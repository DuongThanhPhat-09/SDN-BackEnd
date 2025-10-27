const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// ✨ 1. THÊM DÒNG NÀY ĐỂ IMPORT PLUGIN
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    // Các trường khác của bạn như firstname, lastname...

    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ✨ 2. THÊM DÒNG NÀY ĐỂ "GẮN" PLUGIN VÀO SCHEMA
// Dòng này sẽ tự động thêm các trường username, hash, salt
// và các hàm như .authenticate(), .register()...
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
