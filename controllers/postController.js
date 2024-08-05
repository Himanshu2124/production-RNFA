const postModel = require("../models/postModel");
// Create post
const createPostController = async (req, res) => {
    try {
        const { title, description } = req.body
        //validate
        if (!title || !description) {
            return res.status(500).send({
                success: false,
                message: 'Please Provide All Fields'
            })
        }
        const postdata = await postModel({
            title,
            description,
            postedBy: req.auth._id,
        }).save();

        //  res.status(201).send({
        //         success: true,
        //         message: "Post create Successfull",
        //         post,
        //     })

        if(postdata){
            const post = await postModel.find().populate("postedBy", "_id name")
            .sort({_id:-1}).limit(1);
            res.status(201).send({
                success: true,
                message: "Post create Successfull",
                post,
            })
        }
       
    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: true,
            message: "Error in Create Post API",
            error
        })
    }
};

//GET ALL POSTS

const getAllPostsContoller = async (req, res) => {
    try {
        const posts = await postModel
            .find()
            .populate("postedBy", "_id name")
            .sort({ createdAt: -1 });
        // console.log(posts, "testtt")
        res.status(200).send({
            success: true,
            message: 'All Posts Data',
            posts,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error In Get all Posts API',
            error
        })
    }
};
//Get User Posts

const getUserPostsController = async (req, res) => {
    try {
        const userPosts = await postModel.find({ postedBy: req.auth._id })
        res.status(200).send({
            success: true,
            message: "user posts",
            userPosts,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in User POST API',
            error
        });
    };
};
// Delete post
const deletePostController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id>>>", id);
        const response = await postModel.findByIdAndDelete({ _id: id });
        console.log('response', response)
        res.status(200).send({
            success: true,
            message: "Your Post Been Deleted !"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Delete POST API',
            error,
        });
    }
}

//Update Post

const UpdatePostController = async (req, res) => {
    try {
        const { title, description } = req.body;
        //post find
        const post = await postModel.findById({ _id: req.params.id })
        //validation
        if (!title || !description) {
            return res.status(500).send({
                success: false,
                message: "Please Provide Post Title Or Description",
            });
        }
        const updatedPost = await postModel.findByIdAndUpdate({_id:req.params.id},
        {
            title : title || post?.title ,
            description : description || post?.description

        }, {new:true}
        );
        res.status(200).send({
            success:true,
            message: "post updated Successfully",
            updatedPost,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Update Post API",
            error,
        })
    }
}

module.exports = {
    createPostController,
    getAllPostsContoller,
    getUserPostsController,
    deletePostController,
    UpdatePostController
};