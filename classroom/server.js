const express=require("express");
const app = express();
const users = require("./routes/user.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));


const sessionOptions = {
    secret:"mysupersecretstring",
    resave:false, 
    saveUninitialized:true,
}
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)  => {
    res.locals.messageMsg =req.flash("Success");
    res.locals.errorMsg =req.flash("error");
    next();
});

app.get("/register",(req,res) => {
    let {name = "anonymous"} = req.query;
    // console.log("req.session");
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error","user not registered");
    }else{
        req.flash("success","user registered successfully");
    }
    // console.log(req.session.name);
    // res.send(name);
    res.redirect("/hello");
});

app.get("/hellow",(req,res) => {  
//    res.render("page.ejs",{name:req.session.name , msg:req.flash("success")});
   res.render("page.ejs",{name:req.session.name});
});
// app.get("/reqcount",(req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }

//     res.send(`You sent a request ${req.session.count} times`);
// });

app.get("/test",(req,res) => {
    res.send("test successful!");
});

// app.use(cookieParser("secretcode"));

// app.get("./getsignedcookie",(req,res) =>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie sent");
// });

// app.get("/verify",(req,res) =>{
//     console.log(req.signedcookies);
//     res.send("verified");
// });


// app.get("./getcookie",(req,res) =>{
//     res.cookie("greet","namaste");
//     res.cookie("madein","India");
//     res.send("sent you some cookies !");
// } );

// app.get("/greet",(req,res) => {
//     let{name = "anonymous"} = req.cookies;
//     res.send(`HI,${name}`);
// });


// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//    res.send("Hi,I am Root");
// });
// app.use("/users",users);
// // Posts
// // index
// app.get("/posts",(req,res) => {
//     res.send("GET for Posts");
// });

// // Show
// app.get("/posts/:id",(req,res) => {
//      res.send("Get for post id");
// });

// // Post
// app.post("/posts",(req,res) => {
//      res.send("Post for posts");
// });

// // DELETE
// app.delete("/posts/:id",(req,res) => {
//     res.send("Delete for post id");
// });


app.listen(3000,(req,res)=>{
    console.log("server is listining on port 3000");
})