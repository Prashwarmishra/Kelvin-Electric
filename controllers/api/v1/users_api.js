const User = require("../../../models/user");
const AccessToken = require("../../../models/access_token");
const crypto = require("crypto");
const signUpEmailMailer = require("../../../mailers/sign_up_email_mailer");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");
const PasswordResetToken = require("../../../models/password_reset_token");
const PasswordResetTokenMailer = require("../../../mailers/password_reset_email_mailer");

//create a controller for sign up
module.exports.signUp = async function (req, res) {
  try {
    //handle password and confirm password mismatch
    if (req.body.password != req.body.confirm_password) {
      return res.status(412).json({
        success: false,
        message: "Password and Confirm password does not match, try again.",
      });
    }

    //check if the user already exists in the database
    let user = await User.findOne({ email: req.body.email });

    //handle if user already exists by the provided email
    if (user) {
      return res.status(409).json({
        success: false,
        message: "User Account already exists by the provided Email.",
      });
    }
    //if no user account exists, create an accesstoken and send verification email
    else {
      let newAccessToken = await AccessToken.create({
        accessToken: crypto.randomBytes(20).toString("hex"),
        isValid: true,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      });

      //send verification email
      signUpEmailMailer.signUpAccessToken(newAccessToken);

      //return a success message
      return res.status(200).json({
        success: true,
        message: "User verification link sent, Please check your Email",
      });
    }
  } catch (error) {
    //in case of error console the error
    console.log("Error in creating user account: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//controller to verify the sent mail and create user account
module.exports.verifyAccount = async function (req, res) {
  try {
    //find the accessToken in the database
    let accessToken = await AccessToken.findOne({ accessToken: req.params.id });

    //if accessToken found and is valid
    if (accessToken && accessToken.isValid) {
      //create user
      await User.create({
        name: accessToken.name,
        email: accessToken.email,
        phone: accessToken.phone,
        password: accessToken.password,
      });

      //invalidate the accessToken to restrict further use
      accessToken.isValid = false;
      accessToken.save();

      return res.status(200).json({
        success: true,
        message: "User Account created Successfully, please Login to continue",
      });
    }

    //if accessToken is not found or invalid return 404
    else {
      return res.status(404).json({
        success: false,
        message: "File not Found",
      });
    }
  } catch (error) {
    //in case of error console the error
    console.log("error in user account verification: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//create a controller for signing in users locallly
module.exports.signIn = async function (req, res) {
  try {
    //find the user in the database
    let user = await User.findOne({ email: req.body.email });

    //handle user not found and password mismatch
    if (!user || user.password != req.body.password) {
      return res.status(403).json({
        success: false,
        message: "Invalid user Email/Password",
      });
    }
    //if user found, generate the jwt
    else {
      return res.status(200).json({
        success: true,
        message: "Sign-in successful, here is your json web token",
        data: {
          //create a jwt token for 24 hours
          user: user,
          token: jwt.sign(user.toJSON(), env.jwt_secret, {
            expiresIn: "86400000",
          }),
        },
      });
    }
  } catch (error) {
    //in case of error console the error
    console.log("error in user sign-in: ", error);
    return res.status(500).json({
      success: false,
      message: "internal Server Error",
    });
  }
};

//controller for google sign in/up
module.exports.googleSignIn = function (req, res) {
  //retrive the user data from session cookie, create a json web token and send it back
  return res.status(200).json({
    success: true,
    message: "Google sign-in successful, here is your token",
    data: {
      data: jwt.sign(req.user.toJSON(), env.jwt_secret, {
        expiresIn: "86400000",
      }),
    },
  });
};

//controller for signing out a user
module.exports.signOut = function (req, res) {
  req.logout();
  return res.status(200).json({
    success: true,
    message: "Logged out Successfully!",
  });
};

//controller for updating user info
module.exports.update = async function (req, res) {
  try {
    //locate the user in the database
    let user = await User.findById(req.user.id);

    //check if the user is authorised
    if (user && user.id == req.params.id) {
      //update user profile
      user.name = req.body.name;
      user.password = req.body.password;
      if (req.body.phone) {
        user.phone = req.body.phone;
      }
      user.save();
      return res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
      });
    } else {
      //handle unauthorized requests
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    console.log("Error in updating user profile: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//controller for forget password
module.exports.forgetPassword = async function (req, res) {
  try {
    //locate the user in database
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      //if user found, create a password reset token
      let passwordResetToken = await PasswordResetToken.create({
        token: crypto.randomBytes(20).toString("hex"),
        user: user,
        isValid: true,
      });

      //send the created token to user's email
      PasswordResetTokenMailer.passwordResetToken(passwordResetToken);

      return res.status(200).json({
        success: true,
        message: "Password reset token sent to your Email",
      });
    }
    //handle case when user not found in db
    else {
      return res.status(404).json({
        success: false,
        message: "No username with the provided email exists in the database",
      });
    }
  } catch (error) {
    //in case of error console the error
    console.log("Error in creating password-reset-token: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//controller for resetting user password
module.exports.resetPassword = async function (req, res) {
  try {
    //handle password mismatch
    if (req.body.password != req.body.confirm_password) {
      return res.status(412).json({
        success: false,
        message: "Password and Confirm password does not match, try again.",
      });
    }

    //locate the token in database
    let passwordResetToken = await PasswordResetToken.findOne({
      token: req.params.id,
    });

    //if token found and is valid
    if (passwordResetToken && passwordResetToken.isValid) {
      //locate the user from the token's user id
      let user = await User.findById(passwordResetToken.user);

      //change user password
      user.password = req.body.password;
      user.save();

      //invalidate the token to prevent further use
      passwordResetToken.isValid = false;
      passwordResetToken.save();

      return res.status(200).json({
        success: true,
        message: "Profile password changed, login to continue",
      });
    }
    //handle invalid token
    else {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    //in case of error console the error
    console.log("Error in reseting user password: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//controller for getting user's preorders
module.exports.getAllOrders = async function (req, res) {
  try {
    const preorders = await User.findById(req.params.id).populate("preorders");
    // console.log("user preorders are: ", preorders);

    if (preorders) {
      return res.status(200).json({
        success: true,
        messages: "Users preorder list:",
        data: {
          preorders: preorders.preorders,
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }
  } catch (error) {
    //in case of error console the error
    console.log("Error in fetching preorders: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
