import getpass
from logging import Logger
import logging.config
import socket
import os
from logging.handlers import RotatingFileHandler
import logging
import time


def getLoggerWithoutFile(name) -> Logger:
    root_logger = logging.getLogger(name)
    if len(root_logger.handlers) > 0:
        return root_logger
    root_logger.setLevel(logging.INFO)

    formatter = logging.Formatter(f"%(asctime)s | %(levelname)s | %(message)s")

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    return root_logger
