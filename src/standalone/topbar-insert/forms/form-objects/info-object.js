import { fromJS } from "immutable"
import { licenseForm, licenseObject } from "./license-object"
import { contactForm, contactObject } from "./contact-object"

export const infoForm = (updateForm, path, existingValues) =>
  fromJS({ 
    title: { 
      value: existingValues ? existingValues.get("title") : "", 
      isRequired: true, 
      name: "API服务名称",
      description: "必填。应用程序的标题.",
      updateForm: newForm => updateForm(newForm, path.concat(["title"])),
      validationMessage: "名称是必填项."
    }, 
    description: {
      value: existingValues ? existingValues.get("description") : "", 
      name: "描述",
      description: "应用程序的简短说明。通用标记语法可用于富文本表示.",
      updateForm: newForm => updateForm(newForm, path.concat(["description"]))
    },
    version: {
      value: existingValues ? existingValues.get("version") : "", 
      isRequired: true, 
      name: "版本",
      description: "必填。OpenAPI 文档的版本（与 OpenAPI 规范版本或 API 实现版本不同）",
      updateForm: newForm => updateForm(newForm, path.concat(["version"])),
      validationMessage: "请输入版本。版本字段为必填字段。"
    },
    termsofservice: {
      value: existingValues ? existingValues.get("termsofservice") : "", 
      name: "条款和隐私",
      description: "指向 API 的条款和隐私的 URL。必须采用 URL 的格式。",
      updateForm: newForm => updateForm(newForm, path.concat(["termsofservice"]))
    },
    license: licenseForm(updateForm, path.concat(["license"]), existingValues ? existingValues.get("license") : ""),
    contact: contactForm(updateForm, path.concat(["contact"]))
  })

export const infoObject = (formData) => {
  const newInfo = {
    title: formData.getIn(["title", "value"]),
    version: formData.getIn(["version", "value"])
  }

  const description = formData.getIn(["description", "value"])
  const termsOfService = formData.getIn(["termsofservice", "value"])

  if (description) {
    newInfo.description = description
  }

  if (termsOfService) {
    newInfo.termsOfService = termsOfService
  }

  const contact = contactObject(formData.getIn(["contact"]))
  if (contact) {
    newInfo.contact = contact
  }

  const license = licenseObject(formData.getIn(["license"]))
  if (license) {
    newInfo.license = license
  }

  return newInfo  
}