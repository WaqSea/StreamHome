from urllib.parse import urlsplit


NETWORK_PROTOCOL_WHITELIST = "http,https,tcp,tls,crypto,dns"
HLS_EXTENSIONS = (".m3u8", ".m3u")


def is_http_media_source(url: str) -> bool:
    """Return whether the source uses an FFmpeg-supported HTTP transport."""

    try:
        return urlsplit(url).scheme.lower() in {"http", "https"}
    except ValueError:
        return False


def is_hls_media_source(url: str) -> bool:
    """Identify HLS manifests without treating ordinary HTTP files as HLS."""

    if not is_http_media_source(url):
        return False
    try:
        parsed = urlsplit(url)
    except ValueError:
        return False
    path = parsed.path.lower()
    query = parsed.query.lower()
    return path.endswith(HLS_EXTENSIONS) or "m3u8" in query


def ffmpeg_network_input_options(url: str) -> list[str]:
    """Build transport and demuxer options for the next FFmpeg input.

    ``allowed_extensions`` and ``extension_picky`` are private HLS demuxer
    options. Passing them to a direct MP4/WebM input makes current FFmpeg builds
    abort with "Option ... not found", so they must only accompany a manifest.
    """

    if not is_http_media_source(url):
        return []
    options = ["-protocol_whitelist", NETWORK_PROTOCOL_WHITELIST]
    if is_hls_media_source(url):
        options.extend(["-allowed_extensions", "ALL", "-extension_picky", "0"])
    return options
