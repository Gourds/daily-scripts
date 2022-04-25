---
title: 谷歌GCF发送消息到飞书
date: 2022-04-25 21:00:00
tags: [Python,GCP,GCF]
---

订阅谷歌云事件并发送通知到飞书。直接使用Google的`logging`服务可以订阅事件，然后通过日志路由器，发送事件到订阅（即`PUB/SUB`服务）。此时就可以直接调用Webhook了，不过Google的数据格式和
飞书要求的格式不太统一，需要自己处理一下。这里我选择使用Google的`Cloud Function`服务，直接就可以由订阅Topic中的事件触发

<!--more-->

```python
#/bin/env python
#-*- coding:utf-8 -*-
import base64
import time, hmac, base64, requests, hashlib,json

def hello_pubsub(event, context):
    import base64

    print("""This Function was triggered by messageId {} published at {} to {}
    """.format(context.event_id, context.timestamp, context.resource["name"]))

    if 'data' in event:
        name = base64.b64decode(event['data']).decode('utf-8')
        print('---version 10----')
        print(type(json.loads(name)))
        sendMessageFei(sent_content=format_content(json.loads(name)))
    else:
        name = 'World'
    print('Hello {}!'.format(name))
    # print(event)
    # print(context)

def createFeiSign():
    secret = 'YourSecret'
    timestamp = int(time.time())
    secretBefore = ('%s\n%s' % (timestamp, secret)).encode('utf-8')  # 将值转换为byte类型
    msg = ""
    msgEncode = msg.encode('utf-8')
    hsha256 = hmac.new(secretBefore, msgEncode, digestmod=hashlib.sha256).digest()  # 用hashlib.sha256进行计算，得出HmacSHA256
    sign = base64.b64encode(hsha256).decode()  # 先Base64，再decode去掉byte类型，得到sign值
    return {"timestamp": timestamp, "sign": sign}

def sendMessageFei(sent_content='大家好，我是飞书群助手机器人'):
    #https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN#4996824a
    url = 'https://open.feishu.cn/open-apis/bot/v2/hook/YourFeishuID'
    json = {
        "timestamp": createFeiSign().get('timestamp'),
        "sign": createFeiSign().get('sign'),  # 获取函数的值，并get到具体值
        "msg_type": "interactive",
        "card": {
            "config": {
                "wide_screen_mode": True,
                "enable_forward": True
            },
            "elements": [{
                "tag": "div",
                "text": {
                    "content": sent_content,
                    "tag": "lark_md"
                }
            }, {
                "actions": [{
                    "tag": "button",
                    "text": {
                        "content": ":汗:控制台看看",
                        "tag": "lark_md"
                    },
                    "url": "https://console.cloud.google.com/logs",
                    "type": "default",
                    "value": {}
                }],
                "tag": "action"
            }],
            "header": {
                "title": {
                    "content": "GCP实例事件通知",
                    "tag": "plain_text"
                }
            }
        }
    }
    r = requests.post(url=url, json=json)
    print("send to feishu done")
    print(r.json())

def format_content(data):
    return ("**实例ID**: %s\n"
            "**事件类型**: %s\n"
            "**事件事件**: %s\n"
            "**事件描述**: %s") %(
               data.get('protoPayload',{}).get('resourceName'),
               data.get('protoPayload',{}).get('methodName'),
               data.get('timestamp'),
               data.get('protoPayload',{}).get('status',{}).get('message'))


# if __name__ == '__main__':
#     sendMessageFei(sent_content=format_content(mdata))
```
