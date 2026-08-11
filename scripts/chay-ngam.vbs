' Chạy tác vụ nạp ảnh mà KHÔNG hiện cửa sổ đen.
'
' Windows Task Scheduler gọi node trực tiếp sẽ nháy một cửa sổ console lên
' màn hình mỗi 15 phút — rất phiền khi đang làm việc. File này bọc lại để
' chạy hoàn toàn im lặng.

Dim shell, duAn, node
Set shell = CreateObject("WScript.Shell")

' Thư mục dự án = thư mục cha của thư mục chứa file này
duAn = CreateObject("Scripting.FileSystemObject").GetParentFolderName( _
         CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName))

node = shell.ExpandEnvironmentStrings("%ProgramFiles%\nodejs\node.exe")
If Not CreateObject("Scripting.FileSystemObject").FileExists(node) Then
  node = "node"
End If

shell.CurrentDirectory = duAn
' 0 = ẩn cửa sổ, False = không chờ chạy xong
shell.Run """" & node & """ """ & duAn & "\scripts\tu-dong.mjs""", 0, False
