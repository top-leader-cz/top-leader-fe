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
});
