import sys
import os

# Set PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from routes.queue import is_safe_url

def test_url_validation():
    print("=== Testing URL Protocol Validation ===")
    
    # Safe URLs
    safe_urls = [
        "http://example.com/stream.m3u8",
        "https://example.com/stream.mpd",
        "HTTP://EXAMPLE.COM/VIDEO",
        "HTTPS://EXAMPLE.COM/AUDIO",
    ]
    for url in safe_urls:
        assert is_safe_url(url) is True, f"Failed: {url} should be safe"
        print(f"  [OK] Safe URL parsed correctly: {url}")
        
    # Unsafe URLs
    unsafe_urls = [
        "file:///etc/passwd",
        "file://c:/windows/win.ini",
        "concat:http://example.com/part1|http://example.com/part2",
        "subfile,,pb:http://example.com",
        "gopher://example.com",
        "ftp://example.com",
        "data:text/html;base64,VGVzdA==",
        "C:\\Users\\admin\\secret.txt",
        "/etc/passwd",
        "random_string_without_scheme",
    ]
    for url in unsafe_urls:
        assert is_safe_url(url) is False, f"Failed: {url} should be blocked"
        print(f"  [OK] Blocked unsafe URL scheme: {url}")
        
    print("\n[OK] All URL validation tests passed successfully!")

if __name__ == "__main__":
    try:
        test_url_validation()
    except AssertionError as e:
        print(f"\n[ERR] Test failure: {e}")
        sys.exit(1)
