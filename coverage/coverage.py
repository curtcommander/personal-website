import json
import os
import re

def url_to_f(url):
    return url[-1*url[::-1].find('/'):]
    
coverage_files = []
for file in os.listdir('coverage_files'):
    if '.json' in file:
        coverage_files.append(file)

files = []
ranges = {}
text = {}
for coverage_file in coverage_files:
    with open('coverage_files/'+coverage_file, 'r') as f:
        cov = json.loads(f.read())
    for c in cov:
        filename = url_to_f(c['url'])
        if filename not in files:
            files.append(filename)
            ranges[filename] = []
            text[filename] = c['text']
        else:
            ranges[filename] += c['ranges']

for key in ranges.keys():  
    if '.css' in key:      
        # merge ranges
        ranges_unique = []
        for r in ranges[key]:
            if r not in ranges_unique:
                ranges_unique.append(r)
        ranges[key] = ranges_unique
        del ranges_unique
        
        starts = []
        ends = []
        r = ranges[key]
        for i in range(len(r)):
                starts.append(r[i]['start'])
                ends.append(r[i]['end'])
            
        # media queries
        media_queries = re.findall('@media.*?}}',text[key])
        mq_starts = []
        mq_ends = []
        for mq in media_queries:
            s = text[key].find(mq)
            mq_starts.append(s)
            mq_ends.append(s+len(mq))      
                
        # get used css
        text_cov = ''
        for i in range(len(starts)):
            start = starts[i]
            end = ends[i]
            add = text[key][start:end]
            # check for media queries
            for j in range(len(mq_starts)):
                # media query present
                if mq_starts[j] <= start and mq_ends[j] >= end:
                    mq_open = re.findall('@media.*?{', text[key][mq_starts[j]:mq_starts[j]+100])[0]
                    add = mq_open + add + '}'
            text_cov += add   
        
        # write to file
        with open(key, 'w') as f:
           f.seek(0)
           f.write(text_cov)
           f.truncate()
        
    '''
    ranges_dict = {}
    for i in range(len(ranges)):
        try:
            if ranges_dict[ranges[i]['start']] < ranges[i]['end']:
                ranges_dict[ranges[i]['start']] = ranges[i]['end'] 
        except:
            ranges_dict[ranges[i]['start']] = ranges[i]['end']
    
    
    for i in ranges[key]:
        
    starts = list(ranges.keys())
    ends = [ranges_dict[start] for start in starts]
    
    rm = []
    for i in range(len(starts)):
        for j in range(len(starts)):
            if starts[i] >= starts[j] and ends[i] <= ends[j]:
                rm.append(i)
    
    starts = [starts[i] for i in range(len(starts)) if i not in rm]
    ends = [ends[i] for i in range(len(ends)) if i not in rm]

    '''