import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      maxlength: 255,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      maxlength: 255,
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: true, 
      maxlength: 255 
    },
    role: { 
      type: String, 
      required: true, 
      default: "user", 
      enum: ["user", "admin", "moderator"],
      maxlength: 50 
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar rendimiento (email ya tiene índice por unique: true)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, isActive: 1 }); // Índice compuesto para consultas frecuentes

export const User = mongoose.model("User", userSchema);
