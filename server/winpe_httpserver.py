import http.server
import socketserver
import sys

def createServer():
    PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    Handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()

createServer()
