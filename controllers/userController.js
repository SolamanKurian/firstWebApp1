const User=require("../models/userModel")
const bcrypt=require("bcrypt")

const securePassword=async (password)=>{

    try {
       const passwordHash =await bcrypt.hash(password ,10);
       return passwordHash;
    } catch (error) {
        console.log(error.message);
    }

}

//method to render registration form
const loadRegister=async(req,res)=>{
    try{
res.render('registration')
    }
    catch(error){

        console.log(error.message);
    }
}


//method to insert user data to DB

const insertUser=async(req,res)=>{

    try { 
        const spassword = await securePassword(req.body.password);
        const user=new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:spassword,
            is_admin:0,
        }) 
        const userData= await user.save()
        if(userData){
            res.render('registration',{message:"Registration Completed"})
        }
        else{
            res.render('registration',{message:'your registration is failed'})
        }  
    } catch (error) {
        console.log(error.message);
    }
}

//method to render login page

const loginLoad= async(req,res)=>{
try {
    res.render('login')
    
} catch (error) {
    console.log(error.message);
}

}
// method to verify loggin

const verifyLogin=async(req,res)=>{

    try {
        const email=req.body.email;
        const password=req.body.password;
       const userData= await User.findOne({email:email})

       if (userData) {
         const passwordMatch=  await  bcrypt.compare(password,userData.password)

            if(passwordMatch){
                    req.session.user_id=userData._id;
               res.redirect('/home')

                    }else{
                        res.render('login',{message:"password incorect"});
                            }       

       } else {
        res.render('login',{message:"No email found"});
       }
        
    } catch (error) {
        console.log(error.message);
    }

}
// method to load home page
const loadHome= async(req,res)=>{
    try {

        const userData= await User.findById({_id:req.session.user_id})

       return res.render('home',{user:userData})
        
    } catch (error) {
        console.log(error.message);
    }
    
    }

//method to user logout

const userLogout=async(req,res)=>{

try {
    req.session.destroy() 
    res.redirect('/')
    
} catch (error) {
    console.log(error.message);
}

}

// method to render edit page 

const editLoad=async(req,res)=>{


try {
    const id=req.query.id;
    const userData= await User.findById({_id:id})
    if(userData){
       res.render('edit',{user:userData})
   }else {
    res.redirect('/home')
   }
    
} catch (error) {
    console.log(error.message);
}


}

//method to update user profile in db
const updateProfile=async(req,res)=>{

try {
    
if(req.file){
    const userData= await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email, mobile:req.body.mno,
    
    image:req.file.filename}})

}else{
   const userData= await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email, mobile:req.body.mno}})
}

res.redirect('/home');

} catch (error) {
    console.log(error.message);
}



}

module.exports={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}