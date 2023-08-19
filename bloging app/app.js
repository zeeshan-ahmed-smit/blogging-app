const loginHomeBtn = document.getElementById("loginHomeBtn")
const loginForm = document.getElementById('loginForm');
const loginPass = document.getElementById('loginPass');
const loginEmail = document.getElementById('loginEmail');
const loginBtn = document.getElementById('loginBtn');
const showRegFormBtn = document.getElementById('showRegFormBtn');
const showLogFormBtn = document.getElementById('showLogFormBtn');
const signUpForm = document.getElementById('signUpForm');
const signUpPass = document.getElementById('signUpPass');
const signUpEmail = document.getElementById('signUpEmail');
const signUpName = document.getElementById('signUpName');
const signUpNum = document.getElementById('signUpNum');
const registerBtn = document.getElementById('registerBtn');
const loader = document.getElementById('loader');
const homeBtn = document.getElementById('homeBtn');
const blogBtn = document.getElementById('blogBtn');
const profileBtn = document.getElementById('profileBtn');
const logOutBtn = document.getElementById('logOutBtn');




// Import firebase 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
// import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyA5Q469wRbDybSQHHpktny0uB5gp2J7lLI",
    authDomain: "my-web-415c3.firebaseapp.com",
    projectId: "my-web-415c3",
    storageBucket: "my-web-415c3.appspot.com",
    messagingSenderId: "839305854196",
    appId: "1:839305854196:web:767862b12c9f47201332a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
console.log(auth);

const db = getFirestore(app);
console.log(db);



//add data in fireStore
const addData = async (uid) => {
    let email = signUpEmail.value;
    let UserName = signUpName.value;
    let name = UserName[0].toUpperCase() + UserName.slice(1);
    let number = signUpNum.value;
    console.log(uid)
    await setDoc(doc(db, "users", uid), {
        name: name,
        phoneNumber: number,
        email: email,
    });
    console.log('data add successful')
}



//Register functionality
registerBtn && registerBtn.addEventListener('click', async () => {
    let email = signUpEmail.value;
    let password = signUpPass.value;
    loader.classList.add('active');

    // New user signIn
    createUserWithEmailAndPassword(auth, email, password, signUpName)
        .then((userCredential) => {
            let user = userCredential.user;
            let uid = user.uid;
            let strUid = uid.toString();
            localStorage.key("Uid", strUid)
            loader.classList.remove('active');
            Swal.fire('Registration Successful Now You can Login :');
            loginForm.classList.remove('active');
            signUpForm.classList.remove('active');
            console.log('successful signup user', user);
            signUpEmail.value = '';
            signUpPass.value = '';
            signUpName.value = '';
            signUpNum.value = '';
            addData(uid);
        })
        .catch((error) => {
            let errorMessage = error.message;
            console.log('error msg ', error);
            loader.classList.remove('active');
            if (errorMessage == 'Firebase: Error (auth/invalid-email).') {
                Swal.fire('Invalid Email Please Enter a Valid Email :');
            }
            else if (errorMessage == 'Firebase: Error (auth/missing-password).') {
                Swal.fire('Please Enter Password to Sign Up :');
            }
            else if (signUpName.value == '') {
                Swal.fire('Please fill Name field :');
            }
            else if (signUpNum.value == '') {
                Swal.fire('Please fill Number field :');
            }
            else if (errorMessage == 'Firebase: Error (auth/email-already-in-use).') {
                Swal.fire(`This ${email} is already registered with us.`);
            }
            else if (password.length <= 6) {
                Swal.fire('Your Password must be at least 6 characters long!');
            }
            else {
                Swal.fire('Something went wrong!')
            };
        });
});


// Login Functionality
loginBtn && loginBtn.addEventListener('click', async () => {

    const email = loginEmail.value;
    const password = loginPass.value;
    loader.classList.add('active');


    // user login
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;
            // getData(uid);
            loader.classList.remove('active');
            loginEmail.value = '';
            loginPass.value = '';
            loginForm.classList.add('active');
            location.href = "./dashboard.html";
            console.log('successful login user ', user);
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log("Error msg : ", errorMessage);
            loader.classList.remove('active');
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
                Swal.fire(`User with this email does not exist.`);
            }
            else if (password.length <= 6) {
                Swal.fire('Your Password must be at least 6 characters long!');
            }
            else {
                Swal.fire('Something went wrong!');
            };
        });
});


//logout user
logOutBtn && logOutBtn.addEventListener('click', () => {
    setTimeout(() => {
        auth.signOut();
        location.href = "./index.html"
        loader.classList.remove('active');
        localStorage.clear()
        name.innerHTML = "";
        number.innerHTML = "";
        email.innerHTML = "";
        console.log('successful logout user ')
    }, 500)
});

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         location.pathname = "./dashboard.html"
//         // getData(user.uid);
//         loader.classList.remove('active');
//         console.log('successful login user ', user)
//     }
// });


profileBtn && profileBtn.addEventListener("click", () => {
    location.href = "./profile .html";
});
homeBtn && homeBtn.addEventListener("click", () => {
    location.href = "./index.html";
});

blogBtn && blogBtn.addEventListener("click", () => {
    location.href = "./index.html";
});

//show signUp page
showRegFormBtn && showRegFormBtn.addEventListener('click', () => {
    signUpForm.classList.add('active');
    loginForm.classList.add('active');
    loginEmail.value = '';
    loginPass.value = '';
});

// show login page
showLogFormBtn && showLogFormBtn.addEventListener('click', () => {
    signUpForm.classList.remove('active');
    loginForm.classList.remove('active');
    signUpEmail.value = '';
    signUpPass.value = '';
    signUpName.value = '';
    signUpNum.value = '';
});

// show password login page
const checkBox = document.getElementsByName('checkBox');
checkBox[0] && checkBox[0].addEventListener('click', () => {
    if (checkBox[0].checked == true) {
        loginPass.type = 'text';
    } else {
        loginPass.type = 'password';
    };
});

//show password signUp page
checkBox[1] && checkBox[1].addEventListener('click', () => {
    if (checkBox[1].checked == true) {
        signUpPass.type = 'text';
    } else {
        signUpPass.type = 'password';
    };
});

//show Login form
loginHomeBtn && loginHomeBtn.addEventListener('click', () => {
    location.href = "./login&signUp.html";

});

