
#
# A helper script to interact with the database
# For example, create dummy test entries at mass.
#
# INSTALL:
#
#   pip install firebase-admin
#
# https://pypi.org/project/firebase
#

import sys
import random
import datetime
import time
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("scripts/serviceAccessKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
usersRef = db.collection('users')

def getUserrefById(userid):
    return usersRef.document(userid)

def getUserobjById(userid):
    # return by copy
    return getUserrefById(userid).get().to_dict()

def update(userid, userobj):
    return getUserrefById(userid).update(userobj)

##

def dateToTimestamp(date):
    return int(time.mktime(date.timetuple()))

def pushData(userid, value, device):
    obj = getUserobjById(userid)
    if not "devices" in obj:
        obj["devices"] = {}
    if not device in obj["devices"]:
        obj["devices"][device] = []
    devicedata = obj["devices"][device]
    d = datetime.datetime.now()
    newpacket = {"date": {"seconds": dateToTimestamp(d)}, "value": value}
    devicedata.append(newpacket)
    return update(userid, obj)

def main():
    if len(sys.argv) == 1:
        print("require passing the path of config.js")
        exit(1)
    userid = sys.argv[1]
    print("found user with", userid)
    # pushData(userid, value, device)

def test():
    value = random.randint(600, 1200)
    pushData("testuser2", value, "uv sensor")

if __name__ == '__main__':
    test()
