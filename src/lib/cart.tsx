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
import { site } from "@/lib/site";

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

export type AppliedPromo = {
  code: string;
  label: string;
  type: "percent" | "amount" | "shipping";
  value: number;
};

type CartContextValue = {
  /** false cho tới khi đọc xong localStorage — dùng để tránh nhấp nháy khi hydrate */
  ready: boolean;
  lines: ResolvedLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  promo: AppliedPromo | null;
  promoError: string | null;
  /** Tăng mỗi lần thêm hàng — Header dùng để chạy animation */
  addPulse: number;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);


function readStorage(): { lines: CartLine[]; promoCode: string | null } {
  if (typeof window === "undefined") return { lines: [], promoCode: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lines: [], promoCode: null };
    const parsed = JSON.parse(raw) as {
      lines?: CartLine[];
      promoCode?: string | null;
    };
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      promoCode: parsed.promoCode ?? null,
    };
  } catch {
    return { lines: [], promoCode: null };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawLines, setRawLines] = useState<CartLine[]>([]);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [addPulse, setAddPulse] = useState(0);

  // localStorage chỉ tồn tại trên trình duyệt -> đọc sau khi mount.
  // Không thể đọc lúc render vì HTML được sinh sẵn lúc build (không có giỏ
  // hàng của từng khách), nên đây là ngoại lệ hợp lệ.
  useEffect(() => {
    const stored = readStorage();
    // Bỏ những dòng trỏ tới sản phẩm không còn tồn tại: hàng đã bán và xoá
    // khỏi Sheet, hoặc dữ liệu cũ từ phiên bản web trước. Không lọc thì rác
    // nằm lại trong máy khách mãi mãi.
    const conHieuLuc = stored.lines.filter((l) =>
      products.some((p) => p.id === l.productId),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRawLines(conHieuLuc);
    setPromoCode(stored.promoCode);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lines: rawLines, promoCode }),
      );
    } catch {
      // Chế độ riêng tư của Safari có thể chặn ghi — bỏ qua, giỏ vẫn chạy trong phiên
    }
  }, [rawLines, promoCode, ready]);

  // Đồng bộ giữa nhiều tab đang mở
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      const stored = readStorage();
      setRawLines(stored.lines);
      setPromoCode(stored.promoCode);
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
    setPromoCode(null);
    setPromoError(null);
  }, []);

  const applyPromo = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const found = site.promoCodes.find((p) => p.code === normalized);
    if (!found) {
      setPromoError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      return false;
    }
    setPromoCode(found.code);
    setPromoError(null);
    return true;
  }, []);

  const removePromo = useCallback(() => {
    setPromoCode(null);
    setPromoError(null);
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

  const promo = useMemo<AppliedPromo | null>(() => {
    if (!promoCode) return null;
    const found = site.promoCodes.find((p) => p.code === promoCode);
    return found
      ? { code: found.code, label: found.label, type: found.type, value: found.value }
      : null;
  }, [promoCode]);

  const discount = useMemo(() => {
    if (!promo) return 0;
    if (promo.type === "percent") return Math.round((subtotal * promo.value) / 100);
    if (promo.type === "amount") return Math.min(promo.value, subtotal);
    return 0;
  }, [promo, subtotal]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (promo?.type === "shipping") return 0;
    if (subtotal >= site.shipping.freeThreshold) return 0;
    return site.shipping.fee;
  }, [subtotal, promo]);

  const total = Math.max(0, subtotal - discount) + shippingFee;

  const value: CartContextValue = {
    ready,
    lines,
    itemCount,
    subtotal,
    discount,
    shippingFee,
    total,
    promo,
    promoError,
    addPulse,
    addItem,
    setQuantity,
    removeItem,
    clear,
    applyPromo,
    removePromo,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải nằm trong <CartProvider>");
  return ctx;
}
