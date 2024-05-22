from flask import session

import hvac, os, json

class VaultDynamicDBCredentials:
    def __init__(self, cmd):
        self.cmd = str(cmd)
        self.creds = {}

    def getCreds(self, jwt):
        if not jwt in self.creds:
            client = hvac.Client(url=os.getenv('VAULT_ADDR','http://localhost:8200'), verify=not(bool(os.getenv('VAULT_SKIP_VERIFY', False))))

            client.auth.jwt.jwt_login(
                role=self.cmd.split(' ')[0],
                jwt=jwt,
                path='gitlab'
            )
            dynamic_creds = client.read(self.cmd.split(' ')[2])['data']
            print(json.dumps(dynamic_creds))
            self.creds[jwt] = dynamic_creds
        return self.creds[jwt]
            
    def get(self):
        try:
            return self.getCreds(session['oauth2_token']['id_token'])['password'].strip()
        except:
            return ""
    def getUsername(self):
        try:
            return self.getCreds(session['oauth2_token']['id_token'])['username'].strip()
        except:
            return "none"