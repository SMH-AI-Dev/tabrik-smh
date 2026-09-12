"""تبریک‌ساز SMH — لانچر ویندوز (بدون نیاز به نصب، فقط پایتون)."""
import http.server, functools, webbrowser, os, threading, socket

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "shared")
PORT = 8901

def free_port(p):
    s = socket.socket(); s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]; s.close(); return port

PORT = free_port(PORT)
os.chdir(ROOT)
httpd = http.server.ThreadingHTTPServer(("127.0.0.1", PORT),
        functools.partial(http.server.SimpleHTTPRequestHandler))
url = f"http://127.0.0.1:{PORT}/index.html"
print(f"🎉 تبریک‌ساز SMH در حال اجراست: {url}")
threading.Timer(1.0, lambda: webbrowser.open(url)).start()
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("خدانگهدار! 💜")
