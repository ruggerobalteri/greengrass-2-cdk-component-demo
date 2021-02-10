import awsiot.greengrasscoreipc.client as client
from awsiot.greengrasscoreipc.model import (
    IoTCoreMessage,
    QOS,
    SubscribeToIoTCoreRequest,
    PublishToTopicRequest,
    PublishMessage,
    BinaryMessage
)
import logging

logger = logging.getLogger(__name__)


TIMEOUT = 10
topic = "my/topic"

ipc_utils = IPCUtils()
connection = ipc_utils.connect()
ipc_client = client.GreengrassCoreIPCClient(connection)


class StreamHandler(client.SubscribeToIoTCoreStreamHandler):
    def __init__(self):
        super().__init__()

    def on_stream_event(self, event: IoTCoreMessage) -> None:
        message = str(event.message.payload, "utf-8")
        logger.info("Received message: {}".format(message))
        request = PublishToTopicRequest()
        request.topic = "{}/responsedata".format(topic)
        publish_message = PublishMessage()
        publish_message.binary_message = BinaryMessage()
        publish_message.binary_message.message = bytes(
            "Received: "+message, "utf-8")
        request.publish_message = publish_message
        operation = ipc_client.new_publish_to_topic()
        operation.activate(request)
        future = operation.get_response()
        future.result(TIMEOUT)
        logger.info("Sent message: {} to: {}".format(message, request.topic))
        # Handle message.

    def on_stream_error(self, error: Exception) -> bool:
        logger.warn("Stream error: {}".format(error))
        return True

    def on_stream_closed(self) -> None:
        logger.info("Stream closed: {}")
        pass


def handler():
    logger.info("Component started")
    qos = QOS.AT_MOST_ONCE

    request = SubscribeToIoTCoreRequest()
    request.topic_name = topic
    request.qos = qos
    handler = StreamHandler()
    operation = ipc_client.new_subscribe_to_iot_core(handler)
    logger.info("Component subscribed to topic: {}".format(topic))
    future = operation.activate(request)
    future.result(TIMEOUT)

    # To stop subscribing, close the operation stream.
    # operation.close()


handler()
