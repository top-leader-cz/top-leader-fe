import { defineMessages } from "react-intl";

export const clientsMessages = defineMessages({
  "clients.heading": {
    id: "clients.heading",
    defaultMessage: "Clients",
  },
  "clients.title": {
    id: "clients.title",
    defaultMessage: "Clients",
  },
  "clients.title.count.badge": {
    id: "clients.title.count.badge",
    defaultMessage: `{count, plural, =0 {No Clients} =1 {# Client} other {# Clients}}`,
  },
  "clients.sub": {
    id: "clients.sub",
    defaultMessage: "Here you can see the list of your current clients",
  },
  "clients.add": {
    id: "clients.add",
    defaultMessage: "Add member",
  },
  "clients.table.col.name": {
    id: "clients.table.col.name",
    defaultMessage: "Name",
  },
  "clients.table.col.lastSession": {
    id: "clients.table.col.lastSession",
    defaultMessage: "Last session",
  },
  "clients.table.col.nextSession": {
    id: "clients.table.col.nextSession",
    defaultMessage: "Next session",
  },
  "clients.table.col.action": {
    id: "clients.table.col.action",
    defaultMessage: "Action",
  },
  "clients.table.action.contact": {
    id: "clients.table.action.contact",
    defaultMessage: "Contact client",
  },
  "clients.table.action.decline": {
    id: "clients.table.action.decline",
    defaultMessage: "Decline client",
  },
  "clients.decline.title": {
    id: "clients.decline.title",
    defaultMessage: "Are you sure you want to decline {name}?",
  },
  "clients.decline.yes": {
    id: "clients.decline.yes",
    defaultMessage: "Yes, decline",
  },
  "clients.decline.no": {
    id: "clients.decline.no",
    defaultMessage: "No, cancel",
  },
  "clients.upcoming.all-sessions": {
    id: "clients.upcoming.all-sessions",
    defaultMessage: "All upcoming sessions",
  },
  "clients.upcoming.with-name": {
    id: "clients.upcoming.with-name",
    defaultMessage: "Upcoming sessions with {name}",
  },

  "clients.add-client.modal.title": {
    id: "clients.add-client.modal.title",
    defaultMessage: "Add new member",
  },
  "clients.add-client.modal.desc": {
    id: "clients.add-client.modal.desc",
    defaultMessage: " ",
  },
  "clients.add-client.fields.firstName": {
    id: "clients.add-client.fields.firstName",
    defaultMessage: "First name",
  },
  "clients.add-client.fields.lastName": {
    id: "clients.add-client.fields.lastName",
    defaultMessage: "Last name",
  },
  "clients.add-client.fields.email": {
    id: "clients.add-client.fields.email",
    defaultMessage: "Email",
  },
  "clients.add-client.fields.isTrial": {
    id: "clients.add-client.fields.isTrial",
    defaultMessage: "Trial user",
  },
  "clients.add-client.cancel": {
    id: "clients.add-client.cancel",
    defaultMessage: "Cancel",
  },
  "clients.add-client.submit": {
    id: "clients.add-client.submit",
    defaultMessage: "Send invite",
  },
});
