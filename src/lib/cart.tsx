"use client";

/**
 * Giỏ hàng chạy hoàn toàn phía trình duyệt, lưu trong localStorage.
 * Không cần backend — hợp với static hosting (Hostinger shared).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products, type Product } from "@/lib/products";

const STORAGE_KEY = "keo-cart-v1";

export type CartLine = {
  key: string;
  productId: string;
  quantity: number;
};

export type ResolvedLine = CartLine & {
  product: Product;
  unitPrice: number;
  lineTotal: number;
};

/**
 * KHÔNG có mã giảm giá và KHÔNG cộng phí ship vào tổng.
 *
 * Shop chốt đơn qua Zalo, phí ship tuỳ quãng đường và tuỳ nhà xe nên chỉ chốt
 * được lúc nói chuyện. Cộng sẵn một con số vào tổng chỉ khiến con số trên web
 * khác con số khách thật sự trả. Tổng ở đây = tiền hàng, đúng nghĩa.
 */
type CartContextValue = {
  /** false cho tới khi đọc xong localStorage — dùng để tránh nhấp nháy khi hydrate */
  ready: boolean;
  lines: ResolvedLine[];
  itemCount: number;
  subtotal: number;
  total: number;
  /** Tăng mỗi lần thêm hàng — Header dùng để chạy animation */
  addPulse: number;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);


/**
 * Giỏ cũ (trước khi bỏ mã giảm giá) có thêm khoá `promoCode`. Đọc bỏ qua nó là
 * đủ — không cần dọn, lần ghi kế tiếp sẽ đè lên bằng cấu trúc mới.
 */
function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { lines?: CartLine[] };
    return Array.isArray(parsed.lines) ? parsed.lines : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawLines, setRawLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [addPulse, setAddPulse] = useState(0);

  // localStorage chỉ tồn tại trên trình duyệt -> đọc sau khi mount.
  // Không thể đọc lúc render vì HTML được sinh sẵn lúc build (không có giỏ
  // hàng của từng khách), nên đây là ngoại lệ hợp lệ.
  useEffect(() => {
    // Bỏ những dòng trỏ tới sản phẩm không còn tồn tại: hàng đã bán và xoá
    // khỏi Sheet, hoặc dữ liệu cũ từ phiên bản web trước. Không lọc thì rác
    // nằm lại trong máy khách mãi mãi.
    const conHieuLuc = readStorage().filter((l) =>
      products.some((p) => p.id === l.productId),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRawLines(conHieuLuc);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines: rawLines }));
    } catch {
      // Chế độ riêng tư của Safari có thể chặn ghi — bỏ qua, giỏ vẫn chạy trong phiên
    }
  }, [rawLines, ready]);

  // Đồng bộ giữa nhiều tab đang mở
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      setRawLines(readStorage());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setRawLines((prev) => {
      const existing = prev.find((l) => l.key === productId);
      if (existing) {
        return prev.map((l) =>
          l.key === productId
            ? { ...l, quantity: Math.min(l.quantity + quantity, 99) }
            : l,
        );
      }
      return [...prev, { key: productId, productId, quantity }];
    });
    setAddPulse((n) => n + 1);
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setRawLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) =>
            l.key === key ? { ...l, quantity: Math.min(quantity, 99) } : l,
          ),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setRawLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => {
    setRawLines([]);
  }, []);

  // Giá luôn được tính lại từ `products` — nếu bạn đổi giá trong data,
  // giỏ hàng đã lưu của khách cũng cập nhật theo, không bị giá cũ mắc kẹt.
  const lines = useMemo<ResolvedLine[]>(() => {
    return rawLines.flatMap((line) => {
      const product = products.find((p) => p.id === line.productId);
      // Sản phẩm đã bán hết và bị xoá khỏi Sheet thì tự rơi khỏi giỏ
      if (!product) return [];
      return [
        {
          ...line,
          product,
          unitPrice: product.gia,
          lineTotal: product.gia * line.quantity,
        },
      ];
    });
  }, [rawLines]);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotal, 0),
    [lines],
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );

  // Tổng = tiền hàng. Phí ship không cộng ở đây (xem chú thích đầu file).
  const total = subtotal;

  const value: CartContextValue = {
    ready,
    lines,
    itemCount,
    subtotal,
    total,
    addPulse,
    addItem,
    setQuantity,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải nằm trong <CartProvider>");
  return ctx;
}
