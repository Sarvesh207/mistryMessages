import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";
export async function sendVarificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry Message | Verification code',
            react: VerificationEmail({ username, otp:verifyCode }),
          });
        return {success:true, message:'Verificaton email successful'}

    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {success:false, message:'Failed to send verificaton email'}
        
    }
}