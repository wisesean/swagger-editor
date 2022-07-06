import { fromJS } from "immutable"

export const pathForm = (updateForm, path) => 
  fromJS({ 
    path: { 
      value: "", 
      isRequired: true, 
      name: "Path",          
      description: "必填. 需要添加的API路径.",
      updateForm: event => updateForm(event, path.concat(["path"])),
      validationMessage: "必填以'/'开头的路径.",
      isValid: (value) => value.startsWith("/")
    },
    summary: { 
      value: "", 
      name: "摘要",          
      description: "输入路径的摘要.",
      updateForm: event => updateForm(event, path.concat(["summary"])),
      validationMessage: "操作字段必填。"
    },
    description: {
      value: "",
      name: "描述",
      description: "可选的路径描述字段，描述整个API路径的功能，可支持CommonMark语法进行富文本编辑.",
      updateForm: event => updateForm(event, path.concat(["description"]))
    }
  })

export const pathObject = (formData) => {
  const pathSummary = formData.getIn(["summary", "value"])
  const pathDescription = formData.getIn(["description", "value"])
  const newPath = { key: formData.getIn(["path", "value"]), value: {} }

  if (pathSummary) {
    newPath["value"]["summary"] = pathSummary
  }

  if (pathDescription) {
    newPath["value"]["description"] = pathDescription
  }

  return newPath
}