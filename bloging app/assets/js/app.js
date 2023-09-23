const loginEmail = document.getElementById("login-email");
const loginPass = document.getElementById("login-pass");
const loginBtn = document.getElementById("login-btn");

const signupEmail = document.getElementById("signup-email");
const signupPass = document.getElementById("signup-pass");
const name = document.getElementById("signup-name");

const number = document.getElementById("signup-number");
const signUpBtn = document.getElementById("signup-btn");

let signUp$box = document.getElementById("signUp-box");
let login$box = document.getElementById("login-box");

const logOutBtn = document.getElementById("logOutBtn");
const updateProfileBtn = document.getElementById("updateProfileBtn");
const updateBtn = document.getElementById("updateProfileBtn1");
const exitBtn = document.getElementById("exitBtn");

const loaders = document.getElementById("loaders");
const loaders1 = document.getElementById("loaders1");
const loaders2 = document.getElementById("loaders2");
const loaders3 = document.getElementById("loaders3");
const mainSec= document.getElementById("main");
const mainSec1 = document.getElementById("main1");
const mainSec2 = document.getElementById("main2");
const mainSec3 = document.getElementById("main3");
const updateProfile = document.getElementById('updateProfile');

const userName = document.getElementById("user-name");
const userPhoneNumber = document.getElementById("user-phoneNumber");
const userEmail = document.getElementById("user-email");
const profilePic = document.getElementById("profilePic");
let userUid = document.getElementById("uid");

const title = document.getElementById("title");
const textarea = document.getElementById("textarea");
const publishBlogBtn = document.getElementById("publishBlogBtn");
const boxCOntainer = document.getElementById("myAllBlogs");

const allBlogs = document.getElementById("allBlogs");
const updateBox = document.querySelector(".updateBox");
const exitBtn1 = document.getElementById("exitBtn1");
const updateTitle = document.getElementById("update-title");
const updateTextarea = document.getElementById("updateTextarea");
const updateBlogBtn = document.getElementById("updateBlogBtn");
let id = "";

const userAllBlogs = document.getElementById("userallBlogs");
const userInfo = document.getElementById("userInfo");

// Import the firebase from the firebase.js

import { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, db, doc, setDoc, getDoc, updateDoc, storage, ref, uploadBytesResumable, getDownloadURL, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from "./firebase.js";
console.log("FireBase---->", auth)
console.log("Auth----->", app)
console.log("FireStore----->", db)
console.log("Storage ----->", storage)

let flags = false;


//get current user details from firebase server;
const getCurrentUserData = async (uid) => {
    loaders.classList.add("active");
    mainSec.classList.add("active");
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        userName.value = docSnap.data().name;
        userPhoneNumber.value = docSnap.data().number;
        userEmail.value = docSnap.data().email;
        profilePic.src = docSnap.data().profile ? docSnap.data().profile : "./assets/image/profile-pic.jpg";
        loaders.classList.remove("active");
        mainSec.classList.remove("active");
        userUid.value = docSnap.id;
    } else {
        console.log("No such document!");
    }
};

// delete the document from the database and remove it from the list;
const deleteBlog = async (uid) => {
    try {
        let currentUserUid = auth.currentUser.uid;
        loaders2.classList.add("active");
        mainSec2.classList.add("active");
        let deleteBlog = await deleteDoc(doc(db, "blogs", uid));
        loaders2.classList.remove("active");
        mainSec2.classList.remove("active");
        getCurrentUserBlogs(currentUserUid)
    } catch (err) {
        console.log("Error ", err)
    }
};

// editBlog 
const editBlog = (uid, description, title) => {
    updateBox.classList.add("active");
    id = uid;
    updateTextarea.value = description;
    updateTitle.value = title;
};

//updateBlog
const updateBlog = async (uid) => {
    let id = auth.currentUser.uid;
    loaders2.classList.add("active");
    updateBox.classList.add("active2");
    const userRef = doc(db, "blogs", uid);
    await updateDoc(userRef, {
        description: updateTextarea.value,
        title: updateTitle.value
    });
    Swal.fire('Blog update successful:');
    loaders2.classList.remove("active");
    updateBox.classList.remove("active");
    updateBox.classList.remove("active2");
    getCurrentUserBlogs(id)
}

// get current user blogs
const getCurrentUserBlogs = async (uid) => {
    try {
        boxCOntainer.innerHTML = "";
        const q = query(collection(db, "blogs"), where("currentUserUid", "==", uid));
        loaders2.classList.add("active");
        mainSec2.classList.add("active");
        const querySnapshot = await getDocs(q);
        console.log("docs", querySnapshot.docs)
        if (querySnapshot.docs.length === 0) {
            loaders2.classList.remove("active");
            mainSec2.classList.remove("active");
            boxCOntainer.innerHTML = `
            <div class="box2">
            <p>Empty!</p>
            </div>
            `
            console.log("Empty")
        } else {
            querySnapshot.forEach((doc) => {
                boxCOntainer.innerHTML += `
            <div class="box">
                    <div class="details">
                    <div class="img">
                    <img src="${doc.data().userDetail.profile ? doc.data().userDetail.profile : "./assets/image/profile-pic.jpg"}">
                        </div>
                        <div class="information">
                            <div class="title">
                            <h1>${doc.data().title}</h1>
                                <div class="info">
                                    <h2>${doc.data().userDetail.name}.</h2>
                                    <p>${doc.data().timestamp.toDate().toDateString()}</p>
                                </div>
                            </div>
                            </div>
                            </div>
                    <div class="post">
                        <p>${doc.data().description}</p>
                    </div>
                    <div class="readMore">  
                        <button class="Btn" onClick="deleteBlog('${doc.id}')" id="deleteBtn">Delete</button>
                        <button class="Btn" onclick="editBlog('${doc.id}','${doc.data().description}','${doc.data().title}')"  id="editBtn">Edit</button>
                        </div>
                        </div>
            `;
                loaders2.classList.remove("active");
                mainSec2.classList.remove("active");
            })
        };
    } catch (err) {
        console.log("Error ", err)
    }

};

const getAllBlogs = async () => {
    allBlogs.innerHTML = "";
    mainSec2.classList.add("active");
    loaders2.classList.add("active");
    const querySnapshot = await getDocs(collection(db, "blogs"));
    if (querySnapshot.docs.length === 0) {
        loaders2.classList.remove("active");
        mainSec2.classList.remove("active");
        allBlogs.innerHTML = `
        <div class="box2">
        <p>Empty!</p>
        </div>
        `
        console.log("Empty")
    } else {
        querySnapshot.forEach((doc) => {
            allBlogs.innerHTML += `
            <div class="box">
            <div class="details">
                <div class="img">
                    <img src="${doc.data().userDetail.profile ? doc.data().userDetail.profile : "./assets/image/profile-pic.jpg"}">
                </div>
                <div class="information">
                    <div class="title">
                        <h1>${doc.data().title}</h1>
                        <div class="info">
                            <h2>${doc.data().userDetail.name}.</h2>
                            <p>${doc.data().timestamp.toDate().toDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="post">
                <p>${doc.data().description}</p>
            </div>
            <div class="readMore">
                <a href="seeABFTU.html?user=${doc.data().currentUserUid}">View all blogs</a>
            </div>
        </div>
            `
            loaders2.classList.remove("active");
            mainSec2.classList.remove("active");
        });
    };
};

// get user blogs all  
const getUserBlogs = async (uid) => {
    userAllBlogs.innerHTML = "";
    userInfo.innerHTML = "";
    loaders3.classList.add("active");
    const q = query(collection(db, "blogs"), where("currentUserUid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log("🚀 ~ file: app.js:232 ~ querySnapshot.forEach ~ doc:", doc)
        userInfo.innerHTML = `
        <div class="info-box">
        <div class="user-box-img">
            <img src="${doc.data().userDetail.profile ? doc.data().userDetail.profile : "./assets/image/profile-pic.jpg"}">
        </div>
        <div class="info-details">
            <h1>${doc.data().userDetail.name}</h1>
            <h2>${doc.data().userDetail.email}</h2>
        </div>
    </div>
        `;
        userAllBlogs.innerHTML += ` <div class="box">
        <div class="details">
            <div class="img">
                <img src="${doc.data().userDetail.profile ? doc.data().userDetail.profile : "./assets/image/profile-pic.jpg"}">
            </div>
            <div class="information">
                <div class="title">
                    <h1>${doc.data().title}</h1>
                    <div class="info">
                        <h2>${doc.data().userDetail.name}.</h2>
                        <p>${doc.data().timestamp.toDate().toDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="post">
            <p>${doc.data().description}</p>
        </div>
    </div>`
    })
    loaders3.classList.remove("active");
}

// Auto login user with the help of firebase;
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        if (location.pathname === "/myBlog.html") {
            getCurrentUserBlogs(uid);
        }
        if (location.pathname === "/seeABFTU.html") {
            const param = new URLSearchParams(window.location.search);
            const userUid = param.get('user');
            getUserBlogs(userUid);

        }
        if (location.pathname === "/allBlogs.html") {
            getAllBlogs();
        }
        if (location.pathname === "/profile.html") {
            getCurrentUserData(uid);
        }
        if (location.pathname !== "/myBlog.html" && location.pathname !== "/profile.html" && location.pathname !== "/allBlogs.html" && flags) {
            location.href = "/myBlog.html";
            location.href = "/profile.html";
            location.href = "/allBlogs.html";
        }
    } else {
        if (location.pathname !== "/index.html") {
            location.href = "/index.html";
        }
    }
});


// Create the user with the email and password and  redirect to the login page;
const userSignUp = () => {
    loaders1.classList.add("active");
    mainSec1.classList.add("active");
    signUp$box.classList.add("active2");
    let fullName = name.value[0].toUpperCase() + name.value.slice(1);
    flags = false;
    createUserWithEmailAndPassword(auth, signupEmail.value, signupPass.value)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const userUid = user.uid
            console.log("userId signup successful:", userUid)
            await setDoc(doc(db, "users", userUid), {
                name: fullName,
                number: number.value,
                email: signupEmail.value,
                password: signupPass.value
            });
            flags = true;
            mainSec1.classList.remove("active");
            signUp$box.classList.remove("active2");
            loaders1.classList.remove("active");
            location.href = "/myBlog.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            loaders1.classList.remove("active");
            mainSec1.classList.remove("active");
            signUp$box.classList.remove("active2");
            signupEmail.value = "";
            signupPass.value = "";
            name.value = "";
            name.value = "";
            console.log("error msg and cose---->", errorCode, errorMessage)
            if (errorMessage == 'Firebase: Error (auth/invalid-email).') {
                Swal.fire('Invalid Email Please Enter a Valid Email :');
            }
            else if (errorMessage == 'Firebase: Error (auth/missing-password).') {
                Swal.fire('Please Enter Password to Sign Up :');
            }
            else if (name.value == '') {
                Swal.fire('Please fill Name field :');
            }
            else if (number.value == '') {
                Swal.fire('Please fill Number field :');
            }
            else if (errorMessage == 'Firebase: Error (auth/email-already-in-use).') {
                Swal.fire(`This ${signupEmail.value} is already registered with us.`);
            }
            else if (signupPass.length <= 6) {
                Swal.fire('Your Password must be at least 6 characters long!');
            }
            else {
                Swal.fire('Something went wrong!')
            };

        });
};

// Login with firebase and redirect to main page;
const userSignIn = () => {
    loaders1.classList.add("active");
    mainSec1.classList.add("active");
    login$box.classList.add("active2");
    signInWithEmailAndPassword(auth, loginEmail.value, loginPass.value)
        .then((userCredential) => {
            const user = userCredential.user;
            const userId = user.uid
            console.log("userId login successful:", userId)
            loaders1.classList.remove("active");
            mainSec1.classList.remove("active");
            login$box.classList.remove("active2");
            location.href = "/myBlog.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            loaders1.classList.remove("active");
            mainSec1.classList.remove("active");
            login$box.classList.remove("active2");
            loginEmail.value = "";
            loginPass.value = "";
            console.log("error msg and cose---->", errorCode, errorMessage)
            if (errorMessage == 'Firebase: Error (auth/invalid-email).') {
                Swal.fire('Invalid Email Please Enter a Valid Email :');
            }
            else if (errorMessage == 'Firebase: Error (auth/missing-password).') {
                Swal.fire('Please Enter Password to Login :');
            }
            else if (errorMessage == 'Firebase: Error (auth/wrong-password).') {
                Swal.fire('Incorrect Password! Try again.');
            }
            else if (errorMessage == 'Firebase: Error (auth/user-not-found).') {
                Swal.fire(`User with this ${loginEmail.value} does not exist.`);
            }
            else if (loginPass.length <= 6) {
                Swal.fire('Your Password must be at least 6 characters long!');
            }
            else {
                Swal.fire('Something went wrong!')
            };

        });
};

// publish blog post 
const publishBlog = async () => {
    let uid = auth.currentUser.uid;
    if (title.value === "" && textarea.value === "") {
        Swal.fire('Write Something:');
    } else {
        loaders2.classList.add("active");
        mainSec2.classList.add("active");
        let titleValue = title.value[0].toUpperCase() + title.value.slice(1);
        let description = textarea.value[0].toUpperCase() + textarea.value.slice(1);
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        console.log(docSnap.data());
        const docRef = await addDoc(collection(db, "blogs"), {
            title: titleValue,
            description: description,
            timestamp: serverTimestamp(),
            currentUserUid: uid,
            userDetail: docSnap.data(),
        });
        title.value = "";
        textarea.value = "";
        Swal.fire('Blog has been published:');
        loaders2.classList.remove("active");
        mainSec2.classList.remove("active");
        getCurrentUserBlogs(uid)
    }
}

// User log Out 
const userLogOut = () => {
    auth.signOut();
}


window.deleteBlog = deleteBlog;
window.editBlog = editBlog;

logOutBtn && logOutBtn.addEventListener("click", userLogOut);

signUpBtn && signUpBtn.addEventListener("click", userSignUp);

loginBtn && loginBtn.addEventListener("click", userSignIn);

publishBlogBtn && publishBlogBtn.addEventListener("click", publishBlog);

updateBlogBtn && updateBlogBtn.addEventListener("click", () => {
    updateBlog(id);
});

const file = document.getElementById('file');
const userProfileImg = document.getElementById('userProfileImg');

file && file.addEventListener("change", (e) => {
    let userProfile = URL.createObjectURL(e.target.files[0]);
    userProfileImg.src = userProfile;
})

// upload img in firebase storage
const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `image/users/currentUser/${userUid.value}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log("🚀 ~ file: app.js:235 ~ getDownloadURL ~ downloadURL:", downloadURL)
                    resolve(downloadURL)
                });
            }
        );
    })
};

updateBtn && updateBtn.addEventListener('click', async () => {
    loaders.classList.add("active");
    updateProfile.classList.add("active");
    let name = document.getElementById("update-user-name");
    let phoneNumber = document.getElementById("update-user-phoneNumber");
    let uid = userUid.value;
    let user = {
        name: name.value,
        number: phoneNumber.value,
    }
    if (file.files[0]) {
        user.profile = await uploadFile(file.files[0])
    }
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, user);
    loaders.classList.remove("active");
    updateProfile.classList.remove("active");
    Swal.fire('Profile Update SuccessFull:');
    updateProfile.style.display = "none";
    mainSec.classList.remove("active");
    profilePic.src = "";
    getCurrentUserData(uid)

});

updateProfileBtn && updateProfileBtn.addEventListener("click", () => {
    updateProfile.style.display = "block";
    mainSec.classList.add("active");
});

exitBtn && exitBtn.addEventListener("click", () => {
    mainSec.classList.remove("active");
    updateProfile.style.display = "none";
    let uid = userUid.value;
    getCurrentUserData(uid);
});

exitBtn1 && exitBtn1.addEventListener("click", () => {
    updateBox.classList.remove("active");
});

const login$btn2 = document.getElementById("login-btn2");
login$btn2 && login$btn2.addEventListener('click', () => {
    login$box.classList.remove("active");
    signUp$box.classList.remove("active");
    document.getElementById("h1").innerHTML = "Login";
    loginEmail.value = "";
    loginPass.value = "";

});

const signUp$btn2 = document.getElementById("signUp-btn2");
signUp$btn2 && signUp$btn2.addEventListener('click', () => {
    signUp$box.classList.add("active");
    login$box.classList.add("active");
    document.getElementById("h1").innerHTML = "Sign Up";
    signupEmail.value = "";
    signupPass.value = "";
    name.value = "";
    number.value = "";

});

let eye$off1 = document.getElementById("eye-off1");
eye$off1 && eye$off1.addEventListener('click', () => {
    let password = document.getElementById("login-pass");
    if (password.type === "password") {
        password.type = "text";
        eye$off1.src = "./assets/image/eye-open.svg";
    } else {
        password.type = "password";
        eye$off1.src = "./assets/image/eye-off.svg";
    }
});

let eye$off2 = document.getElementById("eye-off2");
eye$off2 && eye$off2.addEventListener('click', () => {
    let password = document.getElementById("signup-pass");
    if (password.type === "password") {
        password.type = "text";
        eye$off2.src = "./assets/image/eye-open.svg";
    } else {
        password.type = "password";
        eye$off2.src = "./assets/image/eye-off.svg";
    }
});

const goBack = () => {
    window.history.back();
}

let backBtn2 = document.getElementById("backBtn2");
backBtn2 && backBtn2.addEventListener('click', goBack);

let backBtn = document.getElementById("backBtn");
backBtn && backBtn.addEventListener('click', goBack);

const profileBtn = document.getElementById("profileBtn");
profileBtn && profileBtn.addEventListener('click', () => {
    location.href = '/profile.html';
});

const allBlogBtn = document.getElementById("allBlogBtn");
allBlogBtn && allBlogBtn.addEventListener("click", () => {
    location.href = "/allBlogs.html";
})

const myBlogBtn = document.getElementById("myBlogBtn");
myBlogBtn && myBlogBtn.addEventListener("click", () => {
    location.href = "/myBlog.html";
})

















