import datetime as dt
import re

current_year = str(dt.datetime.now().year)


with open('footer.html', 'r') as f:
    html = f.read()
    
tag = re.findall('<p id="copyright">.*?</p>', html)[0]
val = '\u00A9 Curt Commander | '+current_year
tag_new = '<p id="copyright">'+val+'</p>'
html = html.replace(tag, tag_new)

with open('footer.html', 'w', encoding="utf-8") as f:
    f.write(html)
    
