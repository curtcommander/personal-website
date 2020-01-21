def update_container_images(index=False):
    import os
    import re
    import pandas as pd
        
    # get data on instagram posts
    os.chdir('/var/www/html/PersonalWebsite/instagram')
    data_posts = pd.read_csv('data_posts.csv').iloc[:,1:]
    
    # read html file, num_files parameter
    os.chdir('..')
    if index:
        file = 'index.html'
        num_files = 3
    else:
        file = 'gallery.html'
        num_files = len([f for f in os.listdir('instagram/images_insta')])   
        
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # base for new container-images
    image_container_old = re.findall('<div id="container-images".*</div>', html, re.DOTALL)[0]
    extra_props = re.findall('(?<=<div id="container-images")[^>]*?>', image_container_old, re.DOTALL)[0]
    image_container_new = '<div id="container-images"'+extra_props+'\n'
    
    # build div-images tag
    classes = 'div-images col-12 col-sm-6 col-md-4'
    base_tag = '<div class="'
    if classes != '':
            base_tag += classes
    base_tag +='" id="insta[[!NUM]]">\n<div class="img-background">\n'
    
    # loop through posts 
    for i in range(num_files):
        div_tag = base_tag.replace('[[!NUM]]',str(i))
        # img tag
        img_tag = '<img src="instagram/images_insta/insta'+str(i)+'.jpg">'
        div_tag += img_tag+'\n'
        
        # caption tag
        caption_tag = '<div class="caption">'+data_posts.iloc[i,3]+'</div>\n'
        div_tag += caption_tag
        
        # close img-background class, start info class
        div_tag += '</div>\n<div class="info">\n'
        
        #location
        div_tag += data_posts.iloc[i,2]+'<br>\n'
        
        #date
        div_tag += '<i>'+data_posts.iloc[i,1]+'</i>\n'
        
        # close div-images
        div_tag += '</div>\n</div>'
        
        image_container_new += div_tag
    
    # close image_container
    image_container_new += '\n</div>\n</div>\n<div include-html="footer.html"></div>'
    
    # write to file
    html = html.replace(image_container_old,image_container_new)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    update_container_images()