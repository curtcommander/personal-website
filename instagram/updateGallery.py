def update_container_images(index=False):
    import os
    import re
    import pandas as pd
        
    # get data on instagram posts
    os.chdir('/var/www/html/instagram')
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
    re.findall('<div id="container-images".*?[^\t]\t</div>', html, re.DOTALL)[0]
    image_container_old = re.findall('<div id="container-images".*?[^\t]\t</div>', html, re.DOTALL)[0]
    extra_props = re.findall('(?<=<div id="container-images")[^>]*?>', image_container_old, re.DOTALL)[0]
    image_container_new = '<div id="container-images"'+extra_props+'\n\t\t'
    
    # build div-images tag
    classes = 'div-images col-12 col-sm-6 col-md-4'
    base_tag = '<div class="'
    if classes != '':
            base_tag += classes
    base_tag +='">\n\t\t\t<div class="img-background">\n\t\t\t\t'
    
    # loop through posts 
    for i in range(num_files):
        div_tag = base_tag
        # img tag
        img_tag = '<img src="instagram/images_insta/insta'+str(i)+'.jpg">'
        div_tag += img_tag+'\n\t\t\t\t'
        
        # caption tag
        caption_tag = '<div class="caption">'+data_posts.iloc[i,3]+'</div>\n\t\t\t'
        div_tag += caption_tag
        
        # close img-background class, start info class
        div_tag += '</div>\n\t\t\t<div class="info">\n\t\t\t\t'
        
        #location
        div_tag += data_posts.iloc[i,2]+'<br>\n\t\t\t\t'
        
        #date
        div_tag += '<i>'+data_posts.iloc[i,1]+'</i>\n\t\t\t'
        
        # close div-images
        div_tag += '</div>\n\t\t</div>'
        
        image_container_new += div_tag
    
    # close image_container
    image_container_new += '\n\t</div>'
    
    # write to file
    html = html.replace(image_container_old,image_container_new)
    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)

if __name__ == '__main__':
    update_container_images()