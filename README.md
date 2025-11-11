# C1 Paste

A static web application that renders C1 responses using the `@thesysai/genui-sdk`. Perfect for sharing and viewing C1-generated UI components.

## Usage

### Direct Input

1. Visit the application
2. Paste your C1 response into the text area
3. The rendered output will appear below automatically

### URL Sharing

1. Paste your C1 response and click "Copy Shareable URL"
2. Share the generated URL with others
3. When opened, the URL will automatically populate and render the C1 response

### URL Parameter Format

```
https://rabisg.github.io/c1-paste/?c=<compressed-encoded-c1-response>
```

## Programmatic URL Generation

### Python

```python
import gzip
import base64
from urllib.parse import urlencode

def generate_c1_paste_url(c1_response, base_url='https://rabisg.github.io/c1-paste/'):
    """Generate a shareable C1 Paste URL with compressed content."""
    compressed = gzip.compress(c1_response.encode('utf-8'))
    encoded = base64.b64encode(compressed).decode('ascii')
    params = {'c': encoded}
    return f"{base_url}?{urlencode(params)}"
```

### Node.js

```javascript
const zlib = require('zlib');
const { promisify } = require('util'); // Built-in Node.js utility

const gzip = promisify(zlib.gzip);

async function generateC1PasteUrl(c1Response, baseUrl = 'https://rabisg.github.io/c1-paste/') {
  const compressed = await gzip(Buffer.from(c1Response, 'utf-8'));
  const encoded = compressed.toString('base64');
  const url = new URL(baseUrl);
  url.searchParams.set('c', encoded);
  return url.toString();
}
```

## Development

For detailed development instructions, see [DEVELOPMENT.md](DEVELOPMENT.md).

## License

MIT
