from fastapi import APIRouter
import urllib.request
import xml.etree.ElementTree as ET

router = APIRouter()

@router.get("/")
def get_market_news():
    url = "https://economictimes.indiatimes.com/markets/rssfeeds/2146842.cms"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        news_items = []
        
        # Parse RSS 2.0 format
        for item in root.findall('./channel/item'):
            title = item.find('title').text if item.find('title') is not None else "No Title"
            link = item.find('link').text if item.find('link') is not None else "#"
            pubDate = item.find('pubDate').text if item.find('pubDate') is not None else ""
            
            news_items.append({
                "title": title,
                "link": link,
                "pubDate": pubDate
            })
            
            if len(news_items) >= 15: # Limit to 15 news items for the sidebar
                break
                
        return {"status": "success", "news": news_items}
        
    except Exception as e:
        return {"status": "error", "message": f"Failed to fetch real market news: {str(e)}", "news": []}
