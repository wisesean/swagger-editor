import { fromJS } from "immutable"

const tagItem = (updateForm, path) => 
  fromJS({
    tag: {
      value: "",
      isRequired: true, 
      name: "标签",
      description: "标签名必填",
      validationMessage: "请输入标签名称。",
      updateForm: newForm => updateForm(newForm, path.concat(["tag"]))
    }
  })

export const operationForm = (updateForm, path, existingPaths) => 
  fromJS({
    path: { 
      value: "", 
      isRequired: true, 
      name: "Path",          
      description: "API路径必填。",
      updateForm: event => updateForm(event, path.concat(["path"])),
      validationMessage: "请选择API的路径.",
      options: existingPaths || ["请选择"],
      isValid: () => true
    },
    operation: { 
      value: "", 
      isRequired: true,
      name: "",          
      description: "必填，API的方法.",
      updateForm: event => updateForm(event, path.concat(["operation"])),
      validationMessage: "API的方式是必填字段.",
      options: ["get", "put", "post", "delete", "options", "head", "patch", "trace"]
    },
    summary: {
      value: "",
      name: "摘要",
      description: "为API添加一个简短的摘要",
      updateForm: event => updateForm(event, path.concat(["summary"])),
      validationMessage: "Please enter a version. The version field is required."
    },
    description: {
      value: "",
      name: "描述",
      description: "描述API的功能. 支持CommonMark富文本语法.",
      hasErrors: false,
      updateForm: event => updateForm(event, path.concat(["description"]))
    },
    operationid:{
      value: "",
      name: "ID",
      description: "API的唯一标识.在整个文档中应该是唯一的.",
      updateForm: event => updateForm(event, path.concat(["operationid"]))
    },
    tags: {
      value: [],
      name: "标签",
      description: "API的标签分类，为API打标签能够对API进行分类，方便查找.",
      updateForm: newForm => updateForm(newForm, path.concat(["tags"])),
      defaultItem: i => tagItem(updateForm, path.concat(["tags", "value", i]))
    }
  })

export const operationObject = (formData) => {
  const parsedTags = []
  const tags = formData.getIn(["tags", "value"])

  tags.forEach((tag) => {
    parsedTags.push(tag.getIn(["tag", "value"]))
  })

  const newOp = {
    summary: formData.getIn(["summary", "value"]),
    description: formData.getIn(["description", "value"]),
    operationId: formData.getIn(["operationid", "value"]),
    responses: {
      default: {
        description: "默认的错误响应"
      }
    }
  }

  if (parsedTags.length) {
    newOp.tags = parsedTags
  }

  if (!formData.getIn(["path", "value"])) {
    return
  }

  return newOp
}