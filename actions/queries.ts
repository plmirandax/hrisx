import { ApproveLeaveSchema, ApprovePMDSchema, CreateDepartmentSchema, CreateLeaveSchema, CreateLeaveTypeSchema, NewPasswordSchema, RegisterSchema, ResetSchema, SettingsSchema, UploadPayslipSchema } from "@/schemas";
import { prisma } from "@/lib/db";
import { getEmailByApproverId, getEmailByUserId, getEmailByUserIdUpload, getUserByEmail, getUserById } from "@/data/user";
import { sendLeaveNotif, sendPasswordResetEmail, sendUploadNotif, sendVerificationEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { generatePasswordResetToken, generateVerificationToken } from "@/lib/tokens";
import bcrypt from "bcryptjs";
import { signOut, update } from "@/auth";
import { getVerificationTokenByToken } from "@/data/verificiation-token";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";


export const UploadPayslip = async (values: z.infer<typeof UploadPayslipSchema>) => {
    const validatedFields = UploadPayslipSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { payslipFile, months, periods, userId } = validatedFields.data;
  
    await prisma.payslip.create({
      data: {
        payslipFile,
        months,
        periods,
        userId
      },
    });
  
      // Retrieve the email associated with the given userId
      const email = await getEmailByUserIdUpload(userId);
  
      // Send email notification with the payslip URL
      await sendUploadNotif(email, payslipFile, months, periods);
  
  
  
    revalidatePath('/dashboard/payslip')
    return { success: "Payslip uploaded successfully." };
  };
  

  export const settings = async (
    values: z.infer<typeof SettingsSchema>
  ) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unauthorized" }
    }
  
    const dbUser = await getUserById(user.id);
  
    if (!dbUser) {
      return { error: "Unauthorized" }
    }
  
    if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }
  
    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email);
  
      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" }
      }
  
      const verificationToken = await generateVerificationToken(
        values.email
      );
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );
  
      return { success: "Verification email sent!" };
    }
  
    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password,
      );
  
      if (!passwordsMatch) {
        return { error: "Incorrect password!" };
      }
  
      const hashedPassword = await bcrypt.hash(
        values.newPassword,
        10,
      );
      values.password = hashedPassword;
      values.newPassword = undefined;
    }
  
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      }
    });
  
    update({
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      }
    });
  
    return { success: "Settings Updated!" }
  }

  export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid emaiL!" };
    }
  
    const { email } = validatedFields.data;
  
    const existingUser = await getUserByEmail(email);
  
    if (!existingUser) {
      return { error: "Email not found!" };
    }
  
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
  
    return { success: "Reset email sent!" };
  }

  export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);
  
    if (!existingToken) {
      return { error: "Token does not exist!" };
    }
  
    const hasExpired = new Date(existingToken.expires) < new Date();
  
    if (hasExpired) {
      return { error: "Token has expired!" };
    }
  
    const existingUser = await getUserByEmail(existingToken.email);
  
    if (!existingUser) {
      return { error: "Email does not exist!" };
    }
  
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { 
        emailVerified: new Date(),
        email: existingToken.email,
      }
    });
  
    await prisma.verificationToken.delete({
      where: { id: existingToken.id }
    });
  
    return { success: "Email verified!" };
  };
  

  export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema> ,
    token?: string | null,
  ) => {
    if (!token) {
      return { error: "Missing token!" };
    }
  
    const validatedFields = NewPasswordSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { password } = validatedFields.data;
  
    const existingToken = await getPasswordResetTokenByToken(token);
  
    if (!existingToken) {
      return { error: "Invalid token!" };
    }
  
    const hasExpired = new Date(existingToken.expires) < new Date();
  
    if (hasExpired) {
      return { error: "Token has expired!" };
    }
  
    const existingUser = await getUserByEmail(existingToken.email);
  
    if (!existingUser) {
      return { error: "Email does not exist!" }
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });
  
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  
    return { success: "Password updated!" };
  };

  export const createLeaveType = async (values: z.infer<typeof CreateLeaveTypeSchema>) => {
    const validatedFields = CreateLeaveTypeSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { name, description } = validatedFields.data;
  
    await prisma.leaveType.create({
      data: {
        name,
        description
      },
    });
    revalidatePath('/dashboard/settings')
    return { success: "Leave type created successfully!" };
  };


  export const createDepartment = async (values: z.infer<typeof CreateDepartmentSchema>) => {
    const validatedFields = CreateDepartmentSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { name, description } = validatedFields.data;
  
    await prisma.department.create({
      data: {
        name,
        description
      },
    });
    revalidatePath('/dashboard/settings')
    return { success: "Department created successfully!" };
  };

  export const CreateLeave = async (values: z.infer<typeof CreateLeaveSchema>) => {
    const validatedFields = CreateLeaveSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { startDate, endDate, leaveType, reason, approverId, userId, numberOfDays, } = validatedFields.data;
  
    // Create leave record
    await prisma.leave.create({
      data: {
        startDate,
        endDate,
        reason,
        leaveType,
        userId,
        approverId,
        numberOfDays
      },
    });
  
    // Retrieve the email associated with the given approverId
    const email = await getEmailByApproverId(approverId);
    const [firstName, lastName] = await getEmailByUserId(userId);
  
  
    // Send email notification to the approver
    await sendLeaveNotif(email, leaveType, firstName, lastName, startDate, endDate);
  
    // Revalidate the path
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/leave');
  
    return { success: "Leave application successfully submitted!" };
  };

  export const ApproveLeaveRequest = async (values: z.infer<typeof ApproveLeaveSchema> & { id: string }) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unauthorized" };
    }
  
    try {
      const ApprovedLeave = await prisma.leave.update({
        where: { id: values.id }, 
        data: {
          status: values.status,
          approverRemarks: values.approverRemarks,
          pmdStatus: values.pmdStatus,
          pmdRemarks: values.pmdRemarks
        },
      });
  
      revalidatePath('/dashboard/leave/approver')
      return { success: "Updated successfully!" };
    } catch (error) {
      return { error: "An error occurred while updating the leave request." };
    }
  };

  export const fetchDepartment = async () => {
    try {
      const leaveData = await prisma.department.findMany({
      });
      return leaveData;
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };

  export const fetchLeaveDataUser = async (userId: string) => {
    try {
      const leaveData = await prisma.leave.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              image: true,
              department: true
            },
          },
        },
      });
      return leaveData;
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };
  
  export type UserLeaveData = Awaited<ReturnType<typeof fetchLeaveDataUser>>;
  
  
  export const fetchLeaveDataUserApproved = async (userId: string) => {
    try {
      const leaveData = await prisma.leave.findMany({
        where: { userId, status: 'Approved', pmdStatus: 'Approved' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              image: true,
              department: true
            },
          },
        },
      });
      return leaveData;
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };
  
  export type UserLeaveDataApproved = Awaited<ReturnType<typeof fetchLeaveDataUserApproved>>;

  export const fetchLeaveType = async () => {
    try {
      const leaveTypes = await prisma.leaveType.findMany({
      });
      return leaveTypes;
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };

  export const fetchSubordinates = async (approverId: string) => {
    try {
      const subordinates = await prisma.user.findMany({
        where: { approverId },
      });
      return subordinates;
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };

  export const fetchUserApprover = async (approverId: string) => {
    try {
      const approvers = await prisma.user.findMany({
        where: {
           approverId
        }
      });
      return approvers;
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };

  export const fetchLeaveDataApprover = async (approverId: string) => {
    try {
      const leaveData = await prisma.leave.findMany({
        where: { approverId, status: 'Pending' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              image: true,
              department: true
            },
          },
        },
      });
      return leaveData;
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };

  export const ApprovePMDRequest = async (values: z.infer<typeof ApprovePMDSchema> & { id: string }) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unauthorized" };
    }
  
    try {
      const ApprovedLeave = await prisma.leave.update({
        where: { id: values.id }, 
        data: {
          status: values.status,
          pmdStatus: values.pmdStatus,
          pmdRemarks: values.pmdRemarks
        },
      });
  
      revalidatePath('/dashboard/leave/pmd-posting')
      return { success: "Updated successfully!" };
    } catch (error) {
      return { error: "An error occurred while updating the leave request." };
    }
  };

  export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { email, password, firstName, lastName, contactNo, address, approverId, role, department } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const existingUser = await getUserByEmail(email);
  
    if (existingUser) {
      return { error: "Email already in use!" };
    }
  
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        approverId,
        email,
        department,
        password: hashedPassword,
        contactNo,
        address,
        role
      },
    });
  
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
  
    return { success: "Confirmation email sent!" };
  };
  
  
  