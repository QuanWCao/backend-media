const User = require("../model/User");
const sendToken = require("../utils/sendToken");

const register = async (req, res) => {
  try {
      

      const { name,
          email,
          phoneNumber,
          password,
          confirmPassword,

      } = req.body;
   console.log(name, email, phoneNumber, password, confirmPassword);
      
      if(!name || !email || !phoneNumber || !password || !confirmPassword) {
            return res.status(400).json({success : false , message: "ban ga"})
      }
    
    
     const email_user = await User.findOne({ email });
      if (email_user) {
        return res
          .status(400)
          .json({ success: false, message: "Email này đã tồn tại" });
      }
    
    const number_user = await User.findOne({ phoneNumber });
    
      if (number_user) {
        return res
          .status(400)
          .json({ success: false, message: "Số điện thoại này đã tồn tại" });
      }

      if (password != confirmPassword) {
          return res.status(400).json({ success: false, message: "co moi cai mk ma nhap lai khong dung" });
      }
    const newUser = await User({
      name,
      email,
      phoneNumber,
      password,
    });
   
    await newUser.save();
     res.status(201).json({ success: true, message: "oke", newUser});
    sendToken(newUser, 201, res);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
      console.log(phoneNumber, password);
        if (!phoneNumber || !password) {
          return res
            .status(400)
            .json({ success: false, message: "nhap du truong vao" });
        }

        const user = await User.findOne({ phoneNumber }).select("+password");
        if (!user) {
            return res
              .status(400)
            
            .json({ success: false, message: "nhap ngu vua thoi" });
        }
      if (user.role != "user") {
        return res
          .status(400)

          .json({ success: false, message: "ko co quyen truy cap" });
      }
      console.log(user);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res
            .status(400)
            .json({
              success: false,
              message: "Số điện thoại hoặc mật khẩu không hợp lệ",
            });
        }
      
       sendToken(res, user, 200, "Đăng nhập thành công");

    }
    catch (error) {
         return res
           .status(500)
           .json({ success: false, message: error.message });
    }
}
const loginAdmin = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    console.log(phoneNumber, password);
    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ success: false, message: "nhap du truong vao" });
    }

    const user = await User.findOne({ phoneNumber }).select("+password");
    if (!user) {
      return res
        .status(400)

        .json({ success: false, message: "nhap ngu vua thoi" });
    }
    if (user.role != "admin") {
      return res
        .status(400)

        .json({ success: false, message: "ko co quyen truy cap" });
    }
    console.log(user);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Số điện thoại hoặc mật khẩu không hợp lệ",
        });
    }

    sendToken(res, user, 200, "Đăng nhập thành công");

  }
  catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
}
const logout = async (req, res) => {
  try {
     res
       .status(200)
       .cookie("token", null)
       .json({ success: true, message: "Đăng xuất thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

const changePassword= async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id }).select("+password");
    const {oldpassword, password , confirmPassword} = req.body;
    console.log(oldpassword, password, confirmPassword);
    
    if ( !oldpassword ||!password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "nhap du truong vao" });
    }

    //  user = await User.findOne({ phoneNumber }).select("+password");
    // if (!user) {
    //   return res
    //     .status(400)

    //     .json({ success: false, message: "nhap ngu vua thoi" });
    // }
    // console.log(user);
    const isMatch = await user.comparePassword(oldpassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "mat khau ko dung",
      });
    }
    if (password == confirmPassword) {
      user.password = password;
    } else {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không khớp",
      });
    }
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Cập nhật mật khẩu thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const imageFile = req.files.image.tempFilePath;

    if (!imageFile) {
      return res.status(400).json({ message: "Avatar must not be empty." });
    }

    if (
      req.user.avatar.id !==
      "361830248_6399792966771248_2858405288794756845_n_yxes78"
    ) {
      await cloudinary.v2.uploader.destroy(req.user.avatar.id);
    }

    const mycloud = await cloudinary.v2.uploader.upload(imageFile);

    const avatar = {
      id: mycloud.public_id,
      url: mycloud.secure_url,
    };

    const updated = await User.findOneAndUpdate(
      { _id: req.user._id },
      { avatar }
    );

    if (!updated) {
      return res.status(400).json({ message: "This user does not exist." });
    }

    res.json({
      message: "Avatar updated successfully.",
      updated: {
        ...updated._doc,
        password: "",
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "ko co tai khoan nay" });
    }

    sendToken(res, user, 201, `ke ${user.name}`);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getAllUser = async (req, res) => {


  try {
    const accessUser = await User.findById({ _id: req.user._id });
    const roleUser = accessUser.role;
    console.log(roleUser);
    if (roleUser != "user") {
      return res.status(400).json({ message: "ko co quyen truy cap" });
    }
    const user = await User.find();
    const sort = user.sort((a, b) => a.name - b.name);
    

   
  return res.status(200).json({
    success: true,
    message: `all`,
    array: sort,
  });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login ,logout, changePassword,getUser,getAllUser};
