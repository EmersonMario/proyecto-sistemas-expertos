var fs = require('fs');
var Post = require('../models/postModel').Post;
var Template = require('../models/TemplateModel').Template;
var Category = require('../models/CategoryModel').Category;
var Comment = require('../models/CommentModel').Comment;
var User = require('../models/UserModel').User;
var Configuration = require('../models/ConfigurationModel').Configuration;
var {isEmpty} = require('../config/customFunctions');


module.exports = {
    index: (peticion, respuesta)=>{
        respuesta.render('admin/index');
    },
    getPosts: (peticion, respuesta)=>{
        Post.find().populate('category').then(posts =>{
            respuesta.render('admin/posts/index', {posts: posts});
        });
        
    },
    createPostsGet: (peticion, respuesta) => {
        Category.find().then(cats => {
            respuesta.render('admin/posts/create', {categories: cats});
        });
    },
    submitPosts: (peticion, respuesta)=>{
        const commentsAllowed = peticion.body.allowComments ? true:false;
    
        //Validación del Input File
        let fileName = '';

        if(!isEmpty(peticion.files)){
            let file = peticion.files.uploadedFile;
            fileName = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+fileName, (error)=>{
                if(error)
                throw error;
            });
        }

        const newPost = new Post({
            title: peticion.body.title,
            content: peticion.body.content,
            user: peticion.body.user,
            file: `uploads/${fileName}`,
            category: peticion.body.category,
            allowComments: commentsAllowed
        });

        newPost.save().then(post =>{
            console.log(post);
            peticion.flash('success-message', 'Post creado satisfactoriamente.');
            respuesta.redirect('/admin/posts');
        });
    },
    editPost: (peticion, respuesta)=>{
        const id = peticion.params.id;

        Post.findById(id).then(post=>{
            Category.find().then(cats => {
                respuesta.render('admin/posts/edit', {post: post, categories: cats});
            });
        });  
    },
    editPostSubmit: (peticion, respuesta)=>{
        const commentsAllowed = peticion.body.allowComments ? true:false;

        const id = peticion.params.id;

        var fileNameEdit = '';

        if(!isEmpty(peticion.files)){
            let file = peticion.files.uploadedFileEdit;
            fileNameEdit = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+fileNameEdit, (error)=>{
                if(error)
                throw error;
            });
        }

        Post.findById(id).then(post=>{
            post.title = peticion.body.title;
            post.category = peticion.body.category;
            post.allowComments = peticion.body.allowComments;
            post.content = peticion.body.content;
            post.file = `uploads/${peticion.body.uploadedFileEdit}`;

            post.save().then(updatePost=>{
                peticion.flash('success-message', `El post ${updatePost.title} ha sido actualizado`);
                respuesta.redirect('/admin/posts');
            });
        });

    },
    deletePost: (peticion, respuesta)=>{
        Post.findByIdAndDelete(peticion.params.id).then(deletedPost=>{
            peticion.flash('success-message', `El post ${deletedPost.title} ha sido eliminado.`);
            respuesta.redirect('/admin/posts');
        });
    },
    /*Todas los metodos para las categorías*/
    getCategories: (peticion, respuesta)=>{
        Category.find().then(cats=>{
            respuesta.render('admin/category/index', {categories: cats});
        });
    },
    createCategories: (peticion, respuesta)=>{
        var categoryName = peticion.body.name;
        if(categoryName){
            const newCategory = new Category({
                title: categoryName
            });
            newCategory.save().then(category => {
                respuesta.status(200).json(category);
            })
        }
    },
    editCategoriesGetRoute: async (peticion, respuesta)=>{
        const catId = peticion.params.id;
        const cats = await Category.find();

        Category.findById(catId).then(cat =>{
            respuesta.render('admin/category/edit', {category: cat, categories: cats});
        })

    },
    editCategoriesPostRoute: (peticion, respuesta)=>{
        const catId = peticion.params.id;
        const newTitle = peticion.body.name;
        
        if(newTitle){
            Category.findById(catId).then(category=>{
                category.title= newTitle;
                category.save().then(updated=>{
                    respuesta.status(200).json({url: '/admin/category'});
                });
            });
        }
    },
    deleteCategory: (peticion, respuesta)=>{
        Category.findByIdAndDelete(peticion.params.id).then(deletedCategory=>{
            peticion.flash('success-message', `El post ${deletedCategory.title} ha sido eliminado.`);
            respuesta.redirect('/admin/category');
        });
    },
    /*Todos los metodos para los comentarios*/
    getComments: (peticion, respuesta)=>{
        Comment.find().populate('user').then(comments=>{
            respuesta.render('admin/comments/index', {comments: comments});
        });
    },
    approveComment: (peticion, respuesta)=>{
        const id = peticion.params.id;

        Comment.findById(id).then(comment=>{
            comment.commentIsApproved = true;

            comment.save().then(updateComment=>{
                peticion.flash('success-message', `El comentario ha sido aprobado`);
                respuesta.redirect('/admin/comment');
            });
        });
    },
    /*Todos los metodos para los usuarios*/
    getUsers: (peticion, respuesta)=>{
        User.find().populate('comment').then(users=>{
            respuesta.render('admin/users/index', {users: users});
        });
    },
    adminTrue: (peticion, respuesta)=>{
        const id = peticion.params.id;

        User.findById(id).then(user=>{
            user.isAdmin = true;

            user.save().then(updateUser=>{
                peticion.flash('success-message', `Usuario ya es administrador`);
                respuesta.redirect('/admin/user');
            });
        });
    },
    /*Todos los metodos para las configuraciones*/
    getConfigurations: (peticion, respuesta)=>{
        Configuration.find().then(configurations =>{
            respuesta.render('admin/configurations/index', {configurations: configurations});
        });
    },
    editFileFavicon: (peticion, respuesta)=>{
        let fileName = 'favicon.ico';

        if(!isEmpty(peticion.files)){
            let file = peticion.files.fileFavicon;
            //fileName = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+fileName, (error)=>{
                if(error)
                throw error;
            });
        }

        Configuration.findById('5d8561039709f1199c921feb').then(editFile1=>{
            editFile1.fileFavicon = `uploads/${fileName}`;

            editFile1.save().then(updatedFile1=>{
                peticion.flash('success-message', `Favicon ha sido actualizado satisfactoriamente`);
                respuesta.redirect('/admin/configuration');
            });
        });
    },
    editFileLogo: (peticion, respuesta)=>{
        let fileName = 'logo.png';

        if(!isEmpty(peticion.files)){
            let file = peticion.files.fileLogo;
            //fileName = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+fileName, (error)=>{
                if(error)
                throw error;
            });
        }

        Configuration.findById('5d8561039709f1199c921feb').then(editFile2=>{
            editFile2.fileLogo = `uploads/${fileName}`;

            editFile2.save().then(updatedFile2=>{
                peticion.flash('success-message', `Logotipo ha sido actualizado satisfactoriamente`);
                respuesta.redirect('/admin/configuration');
            });
        });
    },
    editPageTitle: (peticion, respuesta)=>{
        Configuration.findById('5d8561039709f1199c921feb').then(editTitle=>{
            editTitle.pageTitle = peticion.body.pageTitle;

            editTitle.save().then(updatedTitle=>{
                peticion.flash('success-message', `Título ha sido actualizado satisfactoriamente`);
                respuesta.redirect('/admin/configuration');
            });
        });
    },
    editPageDescription: (peticion, respuesta)=>{
        Configuration.findById('5d8561039709f1199c921feb').then(editDescription=>{
            editDescription.pageDescription = peticion.body.pageDescription;

            editDescription.save().then(updatedDescription=>{
                peticion.flash('success-message', `Descripción ha sido actualizada satisfactoriamente`);
                respuesta.redirect('/admin/configuration');
            });
        });
    },
    editPageKeyWords: (peticion, respuesta)=>{
        Configuration.findById('5d8561039709f1199c921feb').then(editKeyWords=>{
            editKeyWords.pageKeyWords = peticion.body.pageKeyWords;

            editKeyWords.save().then(updatedKeyWords=>{
                peticion.flash('success-message', `Las palabras clave han sido actualizadas satisfactoriamente`);
                respuesta.redirect('/admin/configuration');
            });
        });
    },
    /*Todos los metodos para las plantillas*/
    getTemplates: (peticion, respuesta)=>{ 
        Template.find().then(templates =>{
            respuesta.render('admin/templates/index', {templates: templates});
        });
    },
    createTemplate: (peticion, respuesta)=>{ 
        respuesta.render('admin/templates/create'); 
    },
    submitTemplates: (peticion, respuesta)=>{
        //Validación del Input File
        let fileName1 = peticion.body.title+'.html';
        let fileName2 = 'styles.css';
        let fileName3 = 'script.js';

        if(!isEmpty(peticion.files)){
            let file = peticion.files.uploadedFile1;
            //fileName1 = file.name;
            let uploadDir = `./public/templates/${peticion.body.title}/`;
                if (!fs.existsSync(uploadDir)){
                    fs.mkdirSync(uploadDir);
                }

            file.mv(uploadDir+fileName1, (error)=>{
                if(error)
                throw error;
            });
        }

        if(!isEmpty(peticion.files)){
            let file = peticion.files.uploadedFile2;
            //fileName2 = file.name;
            let uploadDir = `./public/templates/${peticion.body.title}/`;
                if (!fs.existsSync(uploadDir)){
                    fs.mkdirSync(uploadDir);
                }
                
            file.mv(uploadDir+fileName2, (error)=>{
                if(error)
                throw error;
            });
        }

        if(!isEmpty(peticion.files)){
            let file = peticion.files.uploadedFile3;
            //fileName3 = file.name;
            let uploadDir = `./public/templates/${peticion.body.title}/`;
                if (!fs.existsSync(uploadDir)){
                    fs.mkdirSync(uploadDir);
                }

            file.mv(uploadDir+fileName3, (error)=>{
                if(error)
                throw error;
            });
        }

        const newTemplate = new Template({
            title: peticion.body.title,
            description: peticion.body.description,
            htmlFile: `templates/${peticion.body.title}/${fileName1}`,
            cssFile: `templates/${peticion.body.title}/${fileName2}`,
            jsFile: `templates/${peticion.body.title}/${fileName3}`
        });

        newTemplate.save().then(template =>{
            console.log(template);
            peticion.flash('success-message', 'Plantilla creada satisfactoriamente.');
            respuesta.redirect('/admin/template');
        });
    },
    activeTemplate: (peticion, respuesta)=>{
        const id = peticion.params.id;

        Template.findById(id).then(template=>{
            template.isActive = true;

            template.save().then(updateTemplate=>{
                peticion.flash('success-message', `Se ha establecido la plantilla`);
                respuesta.redirect('/admin/template');
            });
        });
    }
}

 