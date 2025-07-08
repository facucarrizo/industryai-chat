"use server";

import { z } from "zod";
import { chatConfig } from "@/lib/config";

const leadSchema = z.object({
  name: z.string().min(2, "Name is required."),
  phone: z.string().min(10, "A valid phone number is required."),
  email: z.string().email("A valid email is required."),
  service: z.string().min(1, "Please select a service."),
});

export type LeadData = z.infer<typeof leadSchema>;

export async function saveLead(data: LeadData) {
  const validation = leadSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid data. Please check your inputs.",
    };
  }
  
  // In a real application, you would save this data to Firestore
  console.log("Saving lead to Firestore:", validation.data);

  // And send an email notification
  console.log(`Sending email notification to ${chatConfig.businessEmail}`);

  return {
    success: true,
    message: "Thank you! We have received your information and will be in touch shortly.",
  };
}
