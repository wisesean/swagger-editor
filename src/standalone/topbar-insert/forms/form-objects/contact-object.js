import { fromJS } from "immutable"
import { validateUrl } from "../helpers/validation-helpers"

export const contactForm = (updateForm, path) =>
  fromJS({
    value: { 
      name: { 
        name: "名称",
        value: "", 
        updateForm: newForm => updateForm(newForm, path.concat(["value", "name"]))
      },
      url: {
        name: "URL",
        value: "", 
        updateForm: newForm => updateForm(newForm, path.concat(["value", "url"])),
        isValid: value => validateUrl(value),
        validationMessage: "Please enter a valid URL."
      },
      email: {
        name: "邮箱",
        value: "", 
        updateForm: newForm => updateForm(newForm, path.concat(["value", "email"]))
      }
    },
    name: "联系我",
    description: "公开的 API 的联系信息.",
    updateForm: newForm => updateForm(newForm, path)
  })

export const contactObject = (formData) => {
  const name = formData.getIn(["value", "name", "value"])
  const url = formData.getIn(["value", "url", "value"])
  const email = formData.getIn(["value", "email", "value"])
  const contact = {}

  if (!name && !url && !email) {
    return null
  }

  if (email) {
    contact.email = email
  }

  if (name) {
    contact.name = name
  }

  if (url) {
    contact.url = url
  }

  return contact
}
