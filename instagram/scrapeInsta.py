import requests
from bs4 import BeautifulSoup
import json
import wget
import os
import datetime as dt
import pandas as pd
from PIL import Image 
import re

os.chdir('/var/www/curtcommander.com/html/PersonalWebsite/instagram/images_insta')

username = 'curtcommander'

# get data from instagram
url = 'https://instagram.com/'+username+'/'
response = requests.get(url)
html = response.text
soup = BeautifulSoup(html, 'html.parser')

script = soup.find('script', text=lambda t: t.startswith('window._sharedData'))
page_json = script.text.split(' = ', 1)[1].rstrip(';')
data = json.loads(page_json)
edges = data['entry_data']['ProfilePage'][0]['graphql']['user'] \
            ['edge_owner_to_timeline_media']['edges']
            
# parse out data
data_posts = []
for edge in edges:
    node = edge['node']
            
    img_url = node['display_url']
    
    i = img_url.find('?')
    j = img_url[:i][::-1].find('/')
    filename = img_url[:i][::-1][:j][::-1]
    
    # date
    timestamp = node['taken_at_timestamp']
    date = dt.datetime.fromtimestamp(timestamp).strftime('%m/%d/%Y')
    
    # captions
    try:
        caption = node['edge_media_to_caption']['edges'][0]['node']['text']
        caption = caption.split('\n')[0].rstrip('.')
        hashtags = re.findall('#.*?(?=[ #]|$)',caption)
        if len(hashtags) > 0:
            for hashtag in hashtags:
                caption = caption.replace(hashtag,'')
            caption = caption.strip()
    except: 
        caption = ''
    
    # locations
    try:
        location = node['location']['name']
    except:
        location = ''
    
    data_posts.append([img_url, filename, date, location, caption])

data_posts = pd.DataFrame(data_posts)
data_posts.columns = ['img_url', 'filename', 'date', 'location', 'caption']

# remove all files from  directory
files = [f for f in os.listdir('.')]
for f in files:
    os.remove(f)

# download images in img_urls list
for i in data_posts.index:
    filename = 'insta'+str(i)+'.jpg'
    wget.download(data_posts['img_url'][i])
    os.rename(data_posts['filename'][i], filename)    
    data_posts['filename'][i] = filename
    
    # crop image to be square if horizontal orientation
    img = Image.open(filename)   
    width, height = img.size 
    if width != height:
        crop_val = (width - height)/2
        img = img.crop((crop_val, 0, crop_val+height, height))
        img.save(filename)
    img.close()

data_posts.to_csv('../data_posts.csv', index=False)
