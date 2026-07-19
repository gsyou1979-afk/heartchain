Set WshShell = CreateObject("WScript.Shell")

' 백엔드 시작 (숨김)
WshShell.Run "cmd /c cd /d E:\WorkBuddy\heartchain\backend && npm run start:dev", 0, False

' 백엔드 완전 부팅 대기 (10초)
WScript.Sleep 10000

' 프론트엔드 시작 (숨김)
WshShell.Run "cmd /c cd /d E:\WorkBuddy\heartchain\web && npm run dev", 0, False

' 프론트엔드 빌드 대기 (15초)
WScript.Sleep 15000

' 브라우저 열기
WshShell.Run "http://localhost:3001", 1, False
