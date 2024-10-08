import socket
import json
import uuid

def udp_client(message, server_ip='localhost', server_port=12345):
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client.sendto(message.encode(), (server_ip, server_port))
    data, addr = client.recvfrom(1024)
    print(f"Received '{data.decode()}' from {addr}")

if __name__ == "__main__":
    data = {
        "imei" : "00000",
        "rice_amount": 90,
        "humidity": 65,
        "temperature": 30,
        "rsrp":0
    }
    print(json.dumps(data))
    udp_client(json.dumps(data))
