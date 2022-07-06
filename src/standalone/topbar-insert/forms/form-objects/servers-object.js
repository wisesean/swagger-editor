import { fromJS } from "immutable"
import { serverVariableForm, serverVariableObject } from "./server-variable-object"

const serverFormItem = (i, updateForm, path) => fromJS({ 
  url: {
    value: "",
    isRequired: true, 
    name: "URL",
    description: "必填。目标主机的 URL。此 URL 支持服务器变量，并且可能是相对的，以指示主机位置相对于提供 OpenAPI 文档的位置。当变量在 {括号} 中命名时，将进行变量替换。",
    validationMessage: "请输入主机的URL",
    updateForm: newForm => updateForm(newForm, path.concat(["servers", "value", i, "url"]))
  },
  description: {
    value: "",
    name: "描述",
    description: "非必填，描述由 URL 指定的主机的可选字符串。通用标记语法可用于富文本表示。",
    updateForm: newForm => updateForm(newForm, path.concat(["servers", "value", i, "description"]))
  },
  variables: serverVariableForm(updateForm, path.concat(["servers", "value", i, "variables"]))
})

export const serversForm = (updateForm, path) => 
  fromJS({
    servers: {
      value: [serverFormItem(0, updateForm, path)],
      name: "服务器",
      description: "描述服务器",
      updateForm: newForm => updateForm(newForm, path.concat(["servers"])),
      defaultItem: i => serverFormItem(i, updateForm, path)
    }
  })

export const serversObject = (formData) => {
  const servers = formData.getIn(["servers", "value"])
  const newServers = []

  servers.forEach((server) => {
    const newServer = {}
    const variables = serverVariableObject(server.get("variables"))
    const description = server.getIn(["description", "value"])
    const url = server.getIn(["url", "value"])

    if (url) {
      newServer.url = url
    }

    if (variables) {
      newServer.variables = variables
    }

    if (description) {
      newServer.description = description
    }

    newServers.push(newServer)
  })

  return newServers
}