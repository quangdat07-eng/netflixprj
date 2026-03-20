import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { device } = req.query;
  const apiUrl = `https://hieutrungnguyen.com/netflix/api.php?action=generate&device=${device || 'web'}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Thêm header CORS để đảm bảo Vercel cho phép gọi
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch from remote API" });
  }
}
