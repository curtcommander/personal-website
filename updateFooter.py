#!/usr/bin/env python3
import datetime as dt
import re

current_year = str(dt.datetime.now().year)

path = '/var/www/curtcommander.com/html/PersonalWebsite/'

with open(path+'footer.html', 'r') as f:
    html = f.read()
    
tag = re.findall('<p id="copyright">.*?</p>', html)[0]
val = '\u00A9 Curt Commander | '+current_year
tag_new = '<p id="copyright">'+val+'</p>'
html = html.replace(tag, tag_new)

with open(path+'footer.html', 'w', encoding="utf-8") as f:
    f.write(html)
    
