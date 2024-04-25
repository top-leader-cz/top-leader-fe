import { defineMessages } from "react-intl";

export const messages = defineMessages({
  "settings.heading": { id: "settings.heading", defaultMessage: "Settings" },
  "settings.tabs.profile.label": {
    id: "settings.tabs.profile.label",
    defaultMessage: "Profile",
  },
  "settings.tabs.general.label": {
    id: "settings.tabs.general.label",
    defaultMessage: "General",
  },
  "settings.tabs.availability.label": {
    id: "settings.tabs.availability.label",
    defaultMessage: "Availability",
  },
  "settings.tabs.admin.label": {
    id: "settings.tabs.admin.label",
    defaultMessage: "Admin",
  },
  "settings.profile.aside.title": {
    id: "settings.profile.aside.title",
    defaultMessage: "Your coach profile preview",
  },
  "settings.profile.aside.save": {
    id: "settings.profile.aside.save",
    defaultMessage: "Save",
  },
  "settings.profile.heading": {
    id: "settings.profile.heading",
    defaultMessage: "Personal Info",
  },
  "settings.profile.perex": {
    id: "settings.profile.perex",
    defaultMessage: "Update your info here",
  },
  "settings.profile.field.name": {
    id: "settings.profile.field.name",
    defaultMessage: "Name",
  },
  "settings.profile.field.email": {
    id: "settings.profile.field.email",
    defaultMessage: "Email",
  },
  "settings.profile.field.photo": {
    id: "settings.profile.field.photo",
    defaultMessage: "Photo",
  },
  "settings.profile.field.photo.limit": {
    id: "settings.profile.field.photo.limit",
    defaultMessage: "SVG, PNG, JPG or GIF (max. {maxSize})",
  },
  "settings.profile.field.bio": {
    id: "settings.profile.field.bio",
    defaultMessage: "Bio",
  },
  "settings.profile.field.webLink": {
    id: "settings.profile.field.webLink",
    defaultMessage: "Video introduction",
  },
  "settings.profile.field.webLink.placeholder": {
    id: "settings.profile.field.webLink.placeholder",
    defaultMessage: "https://",
  },
  "settings.profile.field.linkedinProfile": {
    id: "settings.profile.field.linkedinProfile",
    defaultMessage: "LinkedIn profile",
  },
  "settings.profile.field.linkedinProfile.placeholder": {
    id: "settings.profile.field.linkedinProfile.placeholder",
    defaultMessage: "https://",
  },
  "settings.profile.field.timezone": {
    id: "settings.profile.field.timezone",
    defaultMessage: "Timezone",
  },
  "settings.profile.field.languages": {
    id: "settings.profile.field.languages",
    defaultMessage: "Languages",
  },
  "settings.profile.field.languages.placeholder": {
    id: "settings.profile.field.languages.placeholder",
    defaultMessage: "Select languages you speak",
  },
  "settings.profile.field.fields": {
    id: "settings.profile.field.fields",
    defaultMessage: "Fields",
  },
  "settings.profile.field.fields.placeholder": {
    id: "settings.profile.field.fields.placeholder",
    defaultMessage: "Select fields you work in",
  },
  "settings.profile.field.certificates": {
    id: "settings.profile.field.certificates",
    defaultMessage: "Certificates",
  },
  "settings.profile.field.certificates.placeholder": {
    id: "settings.profile.field.certificates.placeholder",
    defaultMessage: "Enter certificate",
  },
  "settings.profile.field.experience": {
    id: "settings.profile.field.experience",
    defaultMessage: "Coaching experience",
  },
  "settings.profile.field.level": {
    id: "settings.profile.field.level",
    defaultMessage: "Level",
  },
  "settings.profile.field.rate": {
    id: "settings.profile.field.rate",
    defaultMessage: "Rate",
  },
  "settings.profile.field.publicProfile": {
    id: "settings.profile.field.publicProfile",
    defaultMessage: "Public account",
  },
  "settings.general.heading": {
    id: "settings.general.heading",
    defaultMessage: "General",
  },
  "settings.general.perex": {
    id: "settings.general.perex",
    defaultMessage: "Pavel",
  },
  "settings.general.field.language": {
    id: "settings.general.field.language",
    defaultMessage: "Language",
  },
  "settings.general.field.currentPassword": {
    id: "settings.general.field.currentPassword",
    defaultMessage: "Current password",
  },
  "settings.general.field.newPassword": {
    id: "settings.general.field.newPassword",
    defaultMessage: "New password",
  },
  "settings.general.field.newPasswordConfirm": {
    id: "settings.general.field.newPasswordConfirm",
    defaultMessage: "Confirm new password",
  },
  "settings.general.field.newPasswordConfirm.error-match": {
    id: "settings.general.field.newPasswordConfirm.error-match",
    defaultMessage: "Password confirm must match",
  },
  "settings.general.password": {
    id: "settings.general.password",
    defaultMessage: "Password",
  },
  "settings.general.button.cancel": {
    id: "settings.general.button.cancel",
    defaultMessage: "Cancel",
  },
  "settings.general.button.save": {
    id: "settings.general.button.save",
    defaultMessage: "Update password",
  },
  "settings.general.integrations": {
    id: "settings.general.integrations",
    defaultMessage: "Integrations",
  },
  "settings.general.integrations.google-calendar.title": {
    id: "settings.general.integrations.google-calendar.title",
    defaultMessage: "Google Calendar",
  },
  "settings.general.integrations.google-calendar.description": {
    id: "settings.general.integrations.google-calendar.description",
    defaultMessage: "Sync your appointments with Google Calendar",
  },
  "settings.general.integrations.google-calendar.connect": {
    id: "settings.general.integrations.google-calendar.connect",
    defaultMessage: "Connect",
  },
  "settings.availability.aside.title": {
    id: "settings.availability.aside.title",
    defaultMessage: "Preview",
  },
  "settings.availability.aside.save": {
    id: "settings.availability.aside.save",
    defaultMessage: "Save",
  },
  "settings.availability.heading": {
    id: "settings.availability.heading",
    defaultMessage: "Availability",
  },
  "settings.availability.perex": {
    id: "settings.availability.perex",
    defaultMessage: "Set your availability here",
  },
  "settings.availability.recurring": {
    id: "settings.availability.recurring",
    defaultMessage: "Recurring",
  },
  "settings.availability.unavailable": {
    id: "settings.availability.unavailable",
    defaultMessage: "Unavailable",
  },
  "settings.admin.title": {
    id: "settings.admin.title",
    defaultMessage: "Users",
  },
  "settings.admin.title.count.badge": {
    id: "settings.admin.title.count.badge",
    defaultMessage: "{count} Users",
  },
  "settings.admin.sub": {
    id: "settings.admin.sub",
    defaultMessage: "Here you can see the list of your current clients",
  },
  "settings.admin.add": {
    id: "settings.admin.add",
    defaultMessage: "Add member",
  },
  "settings.admin.table.col.name": {
    id: "settings.admin.table.col.name",
    defaultMessage: "Name",
  },
  "settings.admin.table.col.companyName": {
    id: "settings.admin.table.col.companyName",
    defaultMessage: "Company",
  },
  "settings.admin.table.col.role": {
    id: "settings.admin.table.col.role",
    defaultMessage: "Role",
  },
  "settings.admin.table.col.coach": {
    id: "settings.admin.table.col.coach",
    defaultMessage: "Current Coach",
  },

  "settings.admin.table.col.hrs": {
    id: "settings.admin.table.col.hrs",
    defaultMessage: "HR",
  },
  "settings.admin.table.col.requestedBy": {
    id: "settings.admin.table.col.requestedBy",
    defaultMessage: "Requested by",
  },
  "settings.admin.table.col.paidCredit": {
    id: "settings.admin.table.col.paidCredit",
    defaultMessage: "Credits paid",
  },
  "settings.admin.table.col.remainingCredits": {
    id: "settings.admin.table.col.remainingCredits",
    defaultMessage: "Remaining credits",
  },
  "settings.admin.table.col.requestedCredits": {
    id: "settings.admin.table.col.requestedCredits",
    defaultMessage: "Requested credits",
  },
  "settings.admin.table.col.sumRequestedCredit": {
    id: "settings.admin.table.col.sumRequestedCredit",
    defaultMessage: "All credits",
  },
  "settings.admin.table.col.status": {
    id: "settings.admin.table.col.status",
    defaultMessage: "Status",
  },
  "settings.admin.table.col.action": {
    id: "settings.admin.table.col.action",
    defaultMessage: "Action",
  },
  "settings.admin.table.edit.tooltip": {
    id: "settings.admin.table.edit.tooltip",
    defaultMessage: "Edit",
  },
  "settings.admin.table.confirm-credit-button.label": {
    id: "settings.admin.table.confirm-credit-button.label",
    defaultMessage: "Confirm",
  },

  "settings.admin.member.modal.title": {
    id: "settings.admin.member.modal.title",
    defaultMessage: "Add new member",
  },
  "settings.admin.member.modal.desc": {
    id: "settings.admin.member.modal.desc",
    defaultMessage: "Esse distinctio delectus omnis sint est mollitia.",
  },
  "settings.admin.member.modal.title.edit": {
    id: "settings.admin.member.modal.title.edit",
    defaultMessage: "Edit member",
  },
  "settings.admin.member.modal.desc.edit": {
    id: "settings.admin.member.modal.desc.edit",
    defaultMessage: "Esse distinctio delectus omnis sint est mollitia.",
  },

  "settings.admin.member.modal.fields.firstName": {
    id: "settings.admin.member.modal.fields.firstName",
    defaultMessage: "Name",
  },
  "settings.admin.member.modal.fields.lastName": {
    id: "settings.admin.member.modal.fields.lastName",
    defaultMessage: "Surname",
  },
  "settings.admin.member.modal.fields.username": {
    id: "settings.admin.member.modal.fields.username",
    defaultMessage: "Email",
  },
  "settings.admin.member.modal.fields.companyId": {
    id: "settings.admin.member.modal.fields.companyId",
    defaultMessage: "Company",
  },
  "settings.admin.member.modal.fields.authorities": {
    id: "settings.admin.member.modal.fields.authorities",
    defaultMessage: "Roles",
  },
  "settings.admin.member.modal.fields.coach": {
    id: "settings.admin.member.modal.fields.coach",
    defaultMessage: "Current coach",
  },
  "settings.admin.member.modal.fields.credit": {
    id: "settings.admin.member.modal.fields.credit",
    defaultMessage: "Credit",
  },
  "settings.admin.member.modal.fields.status": {
    id: "settings.admin.member.modal.fields.status",
    defaultMessage: "Status",
  },
  "settings.admin.member.modal.fields.locale": {
    id: "settings.admin.member.modal.fields.locale",
    defaultMessage: "Select languages",
  },
  "settings.admin.member.modal.fields.timeZone": {
    id: "settings.admin.member.modal.fields.timeZone",
    defaultMessage: "Timezone",
  },

  "settings.admin.member.trial": {
    id: "settings.admin.member.trial",
    defaultMessage: "Trial user",
  },
  "settings.admin.member.cancel": {
    id: "settings.admin.member.cancel",
    defaultMessage: "Cancel",
  },
  "settings.admin.member.submit.new": {
    id: "settings.admin.member.submit.new",
    defaultMessage: "Send invite",
  },
  "settings.admin.member.submit.edit": {
    id: "settings.admin.member.submit.edit",
    defaultMessage: "Save",
  },
});
