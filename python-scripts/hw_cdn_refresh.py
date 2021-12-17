# coding: utf-8

from huaweicloudsdkcore.auth.credentials import GlobalCredentials
from huaweicloudsdkcdn.v1.region.cdn_region import CdnRegion
from huaweicloudsdkcore.exceptions import exceptions
from huaweicloudsdkcdn.v1 import *
import argparse

"""
pip install huaweicloudsdkcdn==3.0.71
Python: v3.9.0:9cf6752276
"""

def get_opts():
    parser = argparse.ArgumentParser(
        description='Refresh Hawei CDN'
    )
    parser.add_argument('-i', '--accessKeyID', action='store', dest='accessKeyID', nargs='?',
                        help='Input accessKeyID')
    parser.add_argument('-k', '--accessKeySecret', action='store', dest='accessKeySecret', nargs='?',
                        help='Input accessKeySecret')
    parser.add_argument('-r', '--readFile', action='store', dest='readFile', required=True,
                        help='src file or path.')
    parser.add_argument('-t', '--type', choices=["Refresh", "Preheating"], default="Refresh",dest='type', required=False,
                        help='do what')
    parser.add_argument('-d', '--domainID', action='store', dest='domainId', required=False,
                        help='Input domainID')
    parser.add_argument('-p', '--ProjectId', action='store', dest='ProjectId', required=False,
                        help='Input ProjectId')
    parser.add_argument('-e', '--endpoint', action='store', default='https://cdn.myhuaweicloud.com', dest='endpoint', required=False,
                        help='Input domainID')
    args = parser.parse_args()
    return args

class HuaweiCDN():
    def __init__(self,config):
        credentials = GlobalCredentials(config.get('accessKeyID'),
                                        config.get('accessKeySecret'),
                                        config.get('domainId'))
        self.client = CdnClient.new_builder() \
                    .with_credentials(credentials) \
                    .with_endpoint(config.get('endpoint')) \
                    .build()
        self.filePath = config.get('readFile')
        self.ProjectId = config.get('ProjectId')
    def requests_urls(self):
        with open(self.filePath, 'r') as file:
            lines = file.readlines()
            lines = [line.rstrip() for line in lines]
        return lines


    def refresh(self):
        try:
            request = CreateRefreshTasksRequest()
            request.enterprise_project_id = self.ProjectId
            listRefreshTaskRequestBodyUrlsRefreshTask = self.requests_urls()
            refreshTaskRefreshTaskRequestBody = RefreshTaskRequestBody(
                urls=listRefreshTaskRequestBodyUrlsRefreshTask
            )
            request.body = RefreshTaskRequest(
                refresh_task=refreshTaskRefreshTaskRequestBody
            )
            response = self.client.create_refresh_tasks(request)
            print("Result Code: {}".format(response.status_code))
        except exceptions.ClientRequestException as e:
            print(e.status_code)
            print(e.request_id)
            print(e.error_code)
            print(e.error_msg)

    def preheating(self):
        try:
            request = CreatePreheatingTasksRequest()
            request.enterprise_project_id = self.ProjectId
            listPreheatingTaskRequestBodyUrlsPreheatingTask = self.requests_urls()
            preheatingTaskPreheatingTaskRequestBody = PreheatingTaskRequestBody(
                urls=listPreheatingTaskRequestBodyUrlsPreheatingTask
            )
            request.body = PreheatingTaskRequest(
                preheating_task=preheatingTaskPreheatingTaskRequestBody
            )
            response = self.client.create_preheating_tasks(request)
            print("Result Code: {}".format(response.status_code))
        except exceptions.ClientRequestException as e:
            print(e.status_code)
            print(e.request_id)
            print(e.error_code)
            print(e.error_msg)


if __name__ == "__main__":
    config = vars(get_opts())
    cdnUrls = HuaweiCDN(config)
    if config.get('type') == "Refresh":
        cdnUrls.refresh()
    elif config.get('type') == "Preheating":
        cdnUrls.preheating()
