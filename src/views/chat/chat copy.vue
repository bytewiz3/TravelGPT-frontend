<template>
  <Watermark content="AEGIS" fullscreen> </Watermark>
  <div class="h-full">
    <el-container class="h-full">
      <el-aside width="300px" class="h-full relative">
        <div class="px-5 flex flex-col justify-center items-center">
          <el-button
            type="primary"
            size="large"
            :icon="Plus"
            round
            class="mt-10"
            style="width: 196px; height: 40px"
            @click="handleNewChat(1)"
          >
            New chat
          </el-button>
          <div class="flex flex-col mt-14 w-full px-4" style="color: #4a4a4a">
            <div
              v-for="(item, ind) in list"
              :key="item.name"
              class="flex items-center mb-6 cursor-pointer"
              @click="handle1(ind + 1)"
            >
              <img :src="item.icon" alt="" class="w-6 h-6 mr-4" />
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
        <el-divider />
        <div style="height: calc(100% - 440px)" class="">
          <div class="flex items-center justify-around">
            <el-input
              v-model="hisSearch"
              class="search-ipt"
              style="width: 80%"
              placeholder="Search"
              clearable
              size="large"
              :prefix-icon="Search"
              @change="filterHistory"
            />
            <!-- <div
              style="background: #d2e6ff; width: 40px; height: 40px; border-radius: 4px"
              class="flex items-center justify-center invisible"
            >
              <img src="./imgs/Group.png" alt="" class="cursor-pointer" />
            </div> -->
          </div>

          <div class="flex flex-col px-5 mt-8 his-area">
            <div
              v-for="(item, index) in chatList"
              :key="index"
              :class="{ selected: curChatId === item.id }"
              class="flex flex-col mb-4 items-center cursor-pointer"
              @click="hadnleAction(1, index, item, item.chatMode)"
              @mouseover="handleMouseover(index)"
              @mouseleave="handleMouseleave(index)"
            >
              <div class="flex his-sty items-center cursor-pointer w-full">
                <img
                  v-if="item.chatMode === 2"
                  src="./imgs/icon4.png"
                  alt=""
                  class="w-6 h-6 mr-2"
                />
                <img
                  v-else-if="item.chatMode === 3"
                  src="./imgs/icon1.png"
                  alt=""
                  class="w-5 h-5 mr-2"
                />
                <img v-else src="./imgs/msg.png" alt="" class="w-5 h-5 mr-2" />
                <p
                  v-if="!item.editStatus"
                  class="ellipsis-1"
                  style="width: 70%; color: #4a4a4a"
                >
                  {{ item.key }}
                </p>
                <el-input
                  v-else
                  v-model.trim="item.key"
                  style="width: 70%"
                  placeholder="Please input"
                  @click.stop="inputClick"
                  @change="handleEditKey"
                />
                <img
                  src="./imgs/pencil.png"
                  alt=""
                  class="w-5 h-5 mx-2 hidden"
                  :class="`his-sty-${index}`"
                  @click.stop="hadnleAction(3, index, item, item.chatMode)"
                />
                <img
                  src="./imgs/trash.png"
                  alt=""
                  class="w-5 h-5 hidden"
                  :class="`his-sty-${index}2`"
                  @click.stop="hadnleAction(2, index, item, item.chatMode)"
                />
              </div>
              <div v-if="item.chatMode === 1 && curChatId === item.id">
                <el-button style="width: 240px" class="my-2">
                  <input
                    type="file"
                    id="filePdf"
                    accept=".pdf,.PDF"
                    style="display: none"
                    @change="handleFileSelect"
                  />
                  <div
                    class="cursor-pointer px-2 flex items-center"
                    onclick="event.preventDefault();filePdf.click()"
                  >
                    <img src="./imgs/upload.png" alt="" class="w-4 mr-2" />
                    <span class="font12">Drop documents here</span>
                  </div>
                </el-button>

                <div class="flex flex-col font12" style="color: rgb(74, 74, 74)">
                  <p v-for="item in filsList" :key="item" class="mb-2">{{ item }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="absolute bottom-0 w-full">
          <el-divider />
          <div class="flex justify-center">
            <div
              v-for="(item, ind) in list2"
              :key="item.name"
              class="flex items-center mb-6"
              @click="handleSet(ind + 1)"
            >
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="item.info"
                placement="top-start"
              >
                <img :src="item.icon" alt="" class="w-5 h-5 mx-6 cursor-pointer" />
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-aside>

      <!-- 中间 -->
      <el-main style="background: #f3f7fb; min-width: 500px">
        <el-header class="mt-4">
          <el-row justify="space-between">
            <el-col :span="8">
              <div class="flex items-center">
                <img src="./imgs/logo.png" alt="" style="width: 79px; height: 30px" />
                <el-select
                  v-model="select1"
                  placeholder="Select"
                  style="width: 240px"
                  size="large"
                  class="ml-10"
                  @change="handleSelect"
                >
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="flex items-center">
                <el-input
                  v-model="searchWords"
                  class="search-ipt"
                  style="width: 200px"
                  placeholder="Search"
                  clearable
                  size="large"
                  :prefix-icon="Search"
                  @change="handleSend2"
                />
                <img src="./imgs/trash.png" alt="" class="mx-5" />
                <img src="./imgs/share.png" alt="" />
              </div>
            </el-col>
          </el-row>
        </el-header>

        <el-divider style="margin: 0" />
        <el-main style="padding: 0">
          <div
            class="cont-main talks-container scrollbar"
            id="ChatPanel"
            @scroll="talkPanelScroll($event)"
          >
            <!-- sql模式 -->
            <div v-if="chatMode === 2">
              <div
                class="w-full flex flex-col p-8 rounded-md"
                style="background: #eff5fc; border: 2px solid #2388ff29"
              >
                <div class="flex-col flex">
                  <div class="flex-col flex">
                    <span>Model</span>
                    <el-select
                      class="w-full mt-4"
                      v-model="select1"
                      filterable
                      placeholder="Select"
                    >
                      <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled"
                      />
                    </el-select>
                  </div>
                  <div class="flex-col flex mt-9">
                    <span>Table Structure</span>
                    <el-input
                      class="w-full mt-4"
                      v-model="defaultSql"
                      :autosize="{ minRows: 12, maxRows: 60 }"
                      type="textarea"
                      placeholder="Enter an SQL statement"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- 普通聊天 -->
            <div>
              <!-- 消息主体 -->
              <div v-for="(item, ind) in records" :key="item">
                <div
                  class="message-box record-box"
                  :class="{
                    'direction-rt': item.float == 'right',
                  }"
                >
                  <aside class="avatar-column">
                    <img
                      v-if="item.float == 'left' && item?.type == 2"
                      src="./imgs/file-ai.png"
                      class="rounded-full"
                      style="width: 30px; height: 30px; object-fit: contain"
                    />
                    <img
                      v-if="item.float == 'left' && item?.type != 2"
                      src="./imgs/logo.png"
                      class="rounded-full"
                      style="width: 30px; height: 30px; object-fit: contain"
                    />
                    <img
                      v-if="item.float == 'right'"
                      src="./imgs/user.png"
                      class="rounded-full"
                      style="width: 30px; height: 30px"
                    />
                  </aside>

                  <div class="main-column">
                    <div class="talk-title">
                      <!-- <span class="time flex">
                      <span v-if="item.float === 'left'" class="icon-sty"> 客服 </span>
                      <span :title="item?.name" class="nickname ellipsis-1">
                        {{ item.name }}
                      </span>
                    </span> -->
                      <!-- <el-button :icon="Search" size="small" /> -->
                    </div>

                    <div class="talk-content" v-if="item?.status !== 0">
                      <!-- 文本消息 -->
                      <TextMessage
                        v-if="item?.type !== 2"
                        :content="item.content"
                        :full-width="false"
                        :float="item.float"
                        :arrow="true"
                        :item="item"
                        :isLast="ind === records.length - 1"
                        :highlightedText="searchWords"
                        @sendAgain="sendAgain(item)"
                      />
                    </div>
                    <!-- 文档消息 -->
                    <div v-if="item?.type === 2" class="pdf-text-sty">
                      {{ item?.fileName }} is already in the knowledge base.
                    </div>
                    <div v-if="item?.status == 0">
                      <span style="color: gray" class="font12 relative top-1"
                        >Typing ...</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
        <el-footer>
          <div class="flex flex-col items-center">
            <el-button
              size="large"
              :icon="Refresh"
              class="mt-4"
              :class="{ invisible: !records?.length }"
              style="
                width: 196px;
                height: 40px;
                color: #2388ff;
                border: 1px solid #2388ff;
              "
              @click="handleRep"
            >
              Regenerate Response
            </el-button>

            <p
              :class="{ invisible: !disabledSend }"
              class="mt-4 font-semibold flex items-center align-center"
              style="color: #ff8889"
            >
              <el-icon class="mr-1 font20"><Warning /></el-icon>
              Sensitive information has been detected in the input content. Please revise
              the content to ensure safety and compliance.
            </p>

            <!-- style="display: none" -->

            <el-input
              v-model="keywords"
              style="width: 90%"
              size="large"
              class="mt-4"
              placeholder="Type a message or type “/” to select a prompt..."
              @input="handleChange"
              @change="handleSend"
            >
              <!-- <template #prepend>
                <input
                  type="file"
                  accept=".pdf,.PDF"
                  id="filePdf"
                  style="display: none"
                  @change="handleFileSelect"
                />
                <div
                  class="cursor-pointer font20 px-2"
                  onclick="event.preventDefault();filePdf.click()"
                >
                  <el-icon>
                    <Plus />
                  </el-icon>
                </div>
              </template> -->
              <template #suffix>
                <div>
                  <img
                    v-show="!disabledSend"
                    src="./imgs/send.png"
                    class="cursor-pointer"
                  />
                  <img
                    v-show="disabledSend"
                    src="./imgs/send.png"
                    class="cursor-not-allowed"
                    :style="{ filter: disabledSend ? 'grayscale(1)' : 'none' }"
                  />
                </div>
              </template>
            </el-input>
            <el-link class="mt-4" style="text-decoration: underline" :underline="false">
              GPT Web Platform Instructions for use
            </el-link>
          </div>
        </el-footer>
      </el-main>
      <el-aside width="300px" class="h-full p-5">
        <div class="px-5 flex flex-col justify-center items-center">
          <el-button
            size="large"
            :icon="Plus"
            round
            class="my-10 w-full"
            style="width: 100%; height: 40px"
          >
            New prompt
          </el-button>
        </div>
        <div>
          <div class="flex items-center justify-around">
            <el-input
              class="search-ipt"
              style="width: 200px"
              placeholder="Search"
              clearable
              size="large"
              :prefix-icon="Search"
            />
            <div
              style="background: #d2e6ff; width: 40px; height: 40px; border-radius: 4px"
              class="flex items-center justify-center"
            >
              <img src="./imgs/Group.png" alt="" class="cursor-pointer" />
            </div>
          </div>
        </div>
        <el-divider />
      </el-aside>
    </el-container>

    <!-- 敏感詞提示 -->
    <el-dialog
      v-model="dialogVisible"
      title="Detected sensitive content in the message being sent. Are you sure you want to send it？"
      width="584"
      :lock-scroll="false"
      :before-close="handleClose"
    >
      <span>{{ keywords }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="primary" @click="handleoK"> Confirm </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 隱私和設置彈窗 -->
    <el-dialog
      v-model="dialogVisible2"
      title="Privacy and Safety Settings"
      width="584"
      :show-close="false"
      :lock-scroll="false"
      :before-close="handleClose2"
    >
      <template #header="{ titleId }">
        <div class="flex justify-between">
          <div class="flex items-center font-semibold">
            <img src="./imgs/setting.png" alt="" class="w-4 h-4 mr-2" />
            <h4 :id="titleId">Privacy and Safety Settings</h4>
          </div>
          <el-icon
            @click="handleClose2"
            class="font24 cursor-pointer"
            style="color: #2388ff"
          >
            <Close />
          </el-icon>
        </div>
      </template>
      <el-divider style="margin: 0" />
      <el-alert
        title="Restrictions on Input Containing Sensitive Content"
        type="success"
        :closable="false"
      />
      <div class="flex flex-col">
        <div class="flex justify-between items-center mb-6 mt-6">
          <span>Personal Name</span>
          <el-select
            v-model="value1"
            placeholder="Select"
            size="large"
            style="width: 180px"
            @change="handlePrivacy1"
          >
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="flex justify-between items-center mb-6">
          <span>Phone</span>
          <el-select
            v-model="value2"
            placeholder="Select"
            size="large"
            style="width: 180px"
            @change="handlePrivacy2"
          >
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="flex justify-between items-center mb-6">
          <span>Address</span>
          <el-select
            v-model="value3"
            placeholder="Select"
            size="large"
            style="width: 180px"
            @change="handlePrivacy3"
          >
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="flex justify-between items-center mb-10">
          <span>Finance Info</span>
          <el-select
            v-model="value4"
            placeholder="Select"
            size="large"
            style="width: 180px"
            @change="handlePrivacy4"
          >
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </el-dialog>
  </div>
  <div
    id="pdf_canvas"
    style="width: 200px; height: 200px"
    class="bg-red absolute top-0 -z-10 opacity-0"
  ></div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, nextTick, onBeforeMount, provide, computed } from "vue";
import {
  Search,
  Plus,
  Refresh,
  Bell,
  Loading,
  Promotion,
  Warning,
  Close,
} from "@element-plus/icons-vue";
import TextMessage from "../../components/TextMessage.vue";
import Filter from "bad-words";
import axios from "axios";
import { Local } from "/@/utils/storage.ts";
import Watermark from "./components/Watermark.vue";
import { SyncRedactor } from "redact-pii";
import Tesseract from "tesseract.js";
import * as PDFJS from "pdfjs-dist/es5/build/pdf.js";
PDFJS.GlobalWorkerOptions.workerSrc = import("pdfjs-dist/es5/build/pdf.worker.entry.js");

const router = useRouter();
const setting = ref({});
const regex = /\b(Cash|Accounts Receivable|Inventory|Total Assets|Accounts Payable|Bank Loan Payable|Total Liabilities|Owner's Capital)\b/i;
const regex2 = /\$\d+(,\d{3})*(\.\d{2})?/;
const apiKey = "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";
const api = "https://api.openai.com/v1/chat/completions"; // 官網api
const apiFile = "https://api.openai.com/v1/files"; // 官網api
const headers = {
  "content-type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};
const { name = 1, phoneNumber = 1, streetAddress = 1, finance = 1 } = setting.value || {};
let redactor = ref();
let builtInRedactors = ref({
  names: {
    enabled: name === 2,
    replaceWith: "****",
  },
  username: {
    enabled: name === 2,
    replaceWith: "****",
  },
  phoneNumber: {
    enabled: phoneNumber === 2,
    replacementValue: "****",
  },
  ipAddress: {
    enabled: false,
    replacementValue: "****",
  },
  url: {
    enabled: false,
    replacementValue: "****",
  },
  emailAddress: {
    enabled: false,
    replacementValue: "****",
  },
  streetAddress: {
    enabled: streetAddress === 2,
    replacementValue: "****",
  },
  digits: {
    enabled: false,
    replacementValue: "****",
  },
});
let chatMode = ref(1); // 1:普通聊天模式  2：sql模式
let searchWords = ref(""); // 要匹配的关键字
let dialogVisible = ref(false);
let dialogVisible2 = ref(false);
let select1 = ref(2);
let value1 = ref(1);
let value2 = ref(1);
let value3 = ref(1);
let value4 = ref(1);
let options3 = ref([
  {
    label: "Warning",
    value: 1,
  },
  {
    label: "Redact", // 编辑
    value: 2,
  },
  {
    label: "Restrict", // 限制
    value: 3,
  },
]);
let list = ref([
  // {
  //   label: "Webpage & PDF Summarize",
  //   value: 1,
  //   icon: new URL("./imgs/icon1.png", import.meta.url),
  // },
  {
    label: "Translate",
    value: 2,
    icon: new URL("./imgs/icon2.png", import.meta.url),
  },
  {
    label: "Web Search",
    value: 3,
    icon: new URL("./imgs/icon3.png", import.meta.url),
  },
  {
    label: "Text to SQL",
    value: 4,
    icon: new URL("./imgs/icon4.png", import.meta.url),
  },
]);
let list2 = ref([
  {
    label: "setting",
    value: 1,
    icon: new URL("./imgs/trash.png", import.meta.url),
    info: "Delete",
  },
  {
    label: "download",
    value: 2,
    icon: new URL("./imgs/download.png", import.meta.url),
    info: "Download",
  },
  {
    label: "upload",
    value: 3,
    icon: new URL("./imgs/upload.png", import.meta.url),
    info: "Upload",
  },
  {
    label: "setting",
    value: 4,
    icon: new URL("./imgs/setting.png", import.meta.url),
    info: "Privacy and Safety Settings",
  },
  {
    label: "setting2",
    value: 5,
    icon: new URL("./imgs/setting2.png", import.meta.url),
    info: "Settings",
  },
]);
let options1 = ref([
  {
    label: "Claude 3 Opus",
    value: 1,
    disabled: true,
  },
  {
    label: "GPT-4-1106-pre",
    value: 2,
    model: "gpt-4-1106-preview",
  },
  {
    label: "GPT-4-0125-pre",
    value: 3,
    model: "gpt-4-0125-preview",
  },
  {
    label: "Bard (Gemini Pro)",
    value: 4,
    disabled: true,
  },
  {
    label: "Claude 3 Sonnet",
    value: 5,
    disabled: true,
  },
  {
    label: "GPT-4-0314",
    value: 6,
    model: "gpt-4-0314",
  },
]);
let curChatId = ref(); // 当前聊天记录id
let records = ref([]);

provide(
  "records",
  computed(() => records.value)
);

provide(
  "chatMode",
  computed(() => chatMode.value)
);

provide(
  "curChatId",
  computed(() => curChatId.value)
);

let keywords = ref("");
const filter = new Filter();
let chatList = ref([]);
let hisSearch = ref();
let defaultSql = ref(`CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    age INT
)`);
function talkPanelScroll(el) {
  // el.target.scrollTop = 0;
}

function handleSelect(v) {
  console.log(options1.value.find((e) => e.value === select1.value)?.label);
}

// 聊天窗口滚动到底部
function talkPanelScrollBottom() {
  nextTick(() => {
    let el = document.getElementById("ChatPanel");
    el && (el.scrollTop = el.scrollHeight);
  });
}
let disabledSend = ref(false);

// 禁止操作
function handleChange(v) {
  // benforeSend(v);
  if (!v.length) {
    disabledSend.value = false;
  }
  let disabled = false;

  const { name = 1, phoneNumber = 1, streetAddress = 1, finance = 1 } =
    Local.get("setting") ?? {};

  redactor.value = new SyncRedactor({
    builtInRedactors: {
      names: {
        enabled: true,
        replaceWith: "****",
      },
      username: {
        enabled: true,
        replaceWith: "****",
      },
      phoneNumber: {
        enabled: true,
        replacementValue: "****",
      },
      ipAddress: {
        enabled: false,
        replacementValue: "****",
      },
      url: {
        enabled: false,
        replacementValue: "****",
      },
      emailAddress: {
        enabled: false,
        replacementValue: "****",
      },
      streetAddress: {
        enabled: true,
        replacementValue: "****",
      },
      digits: {
        enabled: false,
        replacementValue: "****",
      },
    },
  });

  let str = redactor.value.redact(v);

  // 禁止
  if (Object.values(Local.get("setting")).some((value) => value === 3)) {
    let f1 = regex.test(v);
    let f2 = regex2.test(v);
    if (name === 3) {
      if (str.includes("PERSON_NAME")) disabled = true;
    }
    if (phoneNumber === 3) {
      if (str.includes("PHONE_NUMBER")) disabled = true;
    }
    if (streetAddress === 3) {
      if (str.includes("STREET_ADDRESS")) disabled = true;
    }
    if (finance === 3) {
      f1 && (disabled = true);
      f2 && (disabled = true);
    }
    if (
      !str.includes("PERSON_NAME") &&
      !str.includes("PHONE_NUMBER") &&
      !str.includes("STREET_ADDRESS") &&
      !f1 &&
      !f2
    ) {
      disabled = false;
    }
    disabledSend.value = disabled;
  }
}

function benforeSend(v) {
  if (!v.length) {
    disabledSend.value = false;
  }
  let disabled = false;
  const { name = 1, phoneNumber = 1, streetAddress = 1, finance = 1 } =
    Local.get("setting") ?? {};

  redactor.value = new SyncRedactor({
    builtInRedactors: {
      names: {
        enabled: true,
        replaceWith: "****",
      },
      username: {
        enabled: true,
        replaceWith: "****",
      },
      phoneNumber: {
        enabled: true,
        replacementValue: "****",
      },
      ipAddress: {
        enabled: false,
        replacementValue: "****",
      },
      url: {
        enabled: false,
        replacementValue: "****",
      },
      emailAddress: {
        enabled: false,
        replacementValue: "****",
      },
      streetAddress: {
        enabled: true,
        replacementValue: "****",
      },
      digits: {
        enabled: false,
        replacementValue: "****",
      },
    },
  });

  let str = redactor.value.redact(v);

  // 警告
  if (Object.values(Local.get("setting")).some((value) => value === 1)) {
    if (name === 1) {
      if (str.includes("PERSON_NAME")) disabled = true;
    }

    if (phoneNumber === 1) {
      if (str.includes("PHONE_NUMBER")) disabled = true;
    }

    if (streetAddress === 1) {
      if (str.includes("STREET_ADDRESS")) disabled = true;
    }
    if (finance === 1) {
      if (regex.test(v) || regex2.test(v)) disabled = true;
    }
  }
  return disabled;
}

function handleSend(v) {
  keywords.value = v.trim();
  if (disabledSend.value) return;
  // 打开敏感提示弹窗
  // if (filter.isProfane(v)) {
  if (benforeSend(v)) {
    dialogVisible.value = true;
  } else {
    let obj = {
      float: "right",
      content: keywords.value,
      role: "user",
      status: 1,
      // role:'assistant',
      index: records.value.length + 1,
    };
    if (v.trim()) {
      records.value.push(obj);
      updateHis();
      records.value.push({
        float: "left",
        role: "assistant",
        status: 0, // 等待回复中
      });
      getGPT(keywords.value);
    }
    talkPanelScrollBottom();
    setTimeout(() => {
      !filter.isProfane(keywords.value) && (keywords.value = "");
    }, 100);
  }
}

// 检索关键词
function handleSend2(v) {
  let copy = records.value.slice(0);
  records.value = [];
  records.value = copy.map((res) => ({
    ...res,
    time: Date.now(),
  }));
  nextTick(() => {
    let targetElement = document.getElementsByClassName("highlight");
    if (targetElement.length) targetElement[0].scrollIntoView({ behavior: "smooth" });
  });
}

function handleClose() {
  dialogVisible.value = false;
}

// 设置窗口关闭
function handleClose2() {
  dialogVisible2.value = false;
  let copy = records.value.slice(0);
  records.value = copy.map((res) => ({
    ...res,
    time: Date.now(),
    needTyped: false,
  }));
}

function handleSet(type) {
  if (type === 4) {
    dialogVisible2.value = true;
  }

  if (type === 5) {
    router.push({ path: "/setting" });
  }
}

function handleoK() {
  dialogVisible.value = false;
  let obj = {
    float: "right",
    content: keywords.value,
    role: "user",
    status: 1,
    // role:'assistant',
    index: records.value.length + 1,
  };
  if (keywords.value.trim()) {
    records.value.push(obj);
    updateHis();
    records.value.push({
      float: "left",
      role: "assistant",
      status: 0, // 等待回复中
    });
    getGPT(keywords.value);
  }
  talkPanelScrollBottom();
  setTimeout(() => {
    keywords.value = "";
  }, 100);
}

function handle1(type) {
  // if (type === 1) {
  //   chatMode.value = 3;
  //   filsList.value = [];
  //   handleNewChat(3);
  // }
  if (type === 3) {
    handleNewChat(2);
  }
}

// 新建窗口
function handleNewChat(mode = 1) {
  filsList.value = [];
  records.value = records.value?.filter((v) => v.status !== 0); // 過濾無效數據
  let old = Local.get("chatList") || [];
  if (records.value?.length) {
    // 更新已存在對象
    if (curChatId.value) {
      let ind = old.findIndex((v) => v.id === curChatId.value);
      if (ind > -1) {
        old[ind].value = records.value;
      }
      // Local.set('chatList', old);
      pubSetlocalList(old);
      records.value = [];
      chatList.value = Local.get("chatList") || [];
      curChatId.value = null;

      // 新增一個
      let val = [
        ...old,
        {
          key: setKeyFun(mode),
          value: [],
          id: Date.now(),
          chatMode: mode,
          needTyped: false,
        },
      ];
      // Local.set('chatList', val);
      pubSetlocalList(val);
      records.value = [];
      chatList.value = Local.get("chatList") || [];
    } else {
      let val = [
        ...old,
        {
          key: records.value[0].content,
          value: records.value,
          id: Date.now(),
          chatMode: mode,
          needTyped: false,
        },
      ];
      // Local.set('chatList', val);
      pubSetlocalList(val);
      records.value = [];
      chatList.value = Local.get("chatList") || [];
    }
  } else {
    // 新增一個
    let val = [
      ...old,
      {
        // key: 'New Conversation',
        key: setKeyFun(mode),
        value: [],
        id: Date.now(),
        chatMode: mode,
        needTyped: false,
      },
    ];
    // Local.set('chatList', val);
    pubSetlocalList(val);
    records.value = [];
    chatList.value = Local.get("chatList") || [];
  }
  chatMode.value = mode;

  curChatId.value = chatList.value[chatList.value.length - 1]?.id;
}

function pubSetlocalList(v) {
  Local.set(
    "chatList",
    v.map((r) => ({ ...r, value: r.value.map((a) => ({ ...a, needTyped: false })) }))
  );
}

function setKeyFun(mode) {
  let obj = {
    1: "New Conversation",
    2: "Text to SQL",
    // 3: "PDF Summarize",
  };
  return obj[mode];
}

// gpt代理方式
function getGPT(content) {
  // sql模式下處理content
  let messages = [];
  if (chatMode.value === 2) {
    messages = records.value
      .filter((v) => v.content && v.status === 1)
      .map((r) => ({
        content: r.content,
        role: r?.role,
      }));
    defaultSql.value &&
      messages.unshift({
        role: "user",
        content: defaultSql.value,
      });
  } else {
    messages = records.value
      .filter((v) => v.content && v.status === 1)
      .map((r) => ({
        content: r.content,
        role: r?.role,
      }));
  }

  // const api = 'https://api.openai-proxy.com/v1/chat/completions';
  const model = options1.value.find((e) => e.value === select1.value)?.model;
  const data = {
    model,
    messages,
  };

  axios
    .post(api, data, {
      headers,
    })
    .then((response) => {
      let res = response?.data?.choices?.[0].message;
      records.value = records.value.filter((e) => e.status === 1);
      records.value.push({
        float: "left",
        name: "AEGIS",
        status: 1,
        ...res,
        needTyped: true,
      });
      updateHis();
      talkPanelScrollBottom();
    })
    .catch((error) => {});
}

function updateHis() {
  let old = Local.get("chatList") || [];
  let ind = old.findIndex((v) => v.id === curChatId.value);
  if (curChatId.value && ind > -1) {
    old[ind].value = records.value;
    pubSetlocalList(old);
  }
}

// 重新生成
function handleRep() {
  let last = records.value.filter((v) => v.float === "right");
  if (last) {
    records.value.push({
      float: "left",
      role: "assistant",
      status: 0, // 等待回复中
    });
    talkPanelScrollBottom();
    getGPT(last[last.length - 1]?.content);
  }
}

function filterHistory(v) {
  if (v) {
    chatList.value = chatList.value.filter((r) => r.key.includes(v));
  } else {
    chatList.value = Local.get("chatList") || [];
  }
}

function handleMouseover(index) {
  const hiddenElement = document.querySelector(`.his-sty-${index}`);
  const hiddenElement2 = document.querySelector(`.his-sty-${index}2`);
  hiddenElement.classList.remove("hidden");
  hiddenElement2.classList.remove("hidden");
}
function handleMouseleave(index) {
  const hiddenElement = document.querySelector(`.his-sty-${index}`);
  const hiddenElement2 = document.querySelector(`.his-sty-${index}2`);
  hiddenElement.classList.add("hidden");
  hiddenElement2.classList.add("hidden");
}

let editInd = ref();
let filsList = ref([]); // 存放对话中上传过的文件信息
function hadnleAction(type, ind, item, mode = 1) {
  filsList.value = [];
  chatMode.value = mode || chatMode.value;
  chatList.value = chatList.value.map((q) => ({
    ...q,
    editStatus: false,
    needTyped: false,
  }));
  // 选中
  if (type === 1) {
    curChatId.value = item.id;
    records.value = Local.get("chatList").find((v) => v.id === curChatId.value)?.value;
    nextTick(() => {
      talkPanelScrollBottom();
    });
    filsList.value = records.value.filter((v) => v.type == 2).map((res) => res.fileName);
  } else if (type === 2) {
    // 删除
    let newArr = chatList.value.filter((item, index) => index !== ind);
    // Local.set('chatList', newArr);
    pubSetlocalList(newArr);
    chatList.value = Local.get("chatList") || [];
    if (curChatId.value === item.id) {
      records.value = [];
      curChatId.value = null;
      FileList.value = [];
      chatMode.value = 1;
    }
  } else {
    // 編輯名稱
    chatList.value[ind].editStatus = true;
    editInd.value = ind;
  }
}

function inputClick() {}

function handleEditKey(v) {
  if (v && editInd.value !== null) {
    chatList.value[editInd.value].key = v;
    chatList.value[editInd.value].editStatus = false;
    // updateHis();
    // Local.set('chatList', chatList.value);
    pubSetlocalList(chatList.value);
    // editInd.value = null;
  }
}

function handlePrivacy1(v) {
  Local.get("setting");
  Local.set("setting", {
    ...Local.get("setting"),
    name: v,
  });
}
function handlePrivacy2(v) {
  Local.get("setting");
  Local.set("setting", {
    ...Local.get("setting"),
    phoneNumber: v,
  });
}
function handlePrivacy3(v) {
  Local.get("setting");
  Local.set("setting", {
    ...Local.get("setting"),
    streetAddress: v,
  });
}
function handlePrivacy4(v) {
  Local.get("setting");
  Local.set("setting", {
    ...Local.get("setting"),
    finance: v,
  });
}

let fileDom = ref();
let selectedFile = ref();
let pdfFile = ref();
function openFile() {}

function handleFileSelect(event) {
  const file = event.target.files[0];
  pdfFile.value = file;
  pdf2Img(file);

  return;
  let reader = new FileReader();
  reader.readAsArrayBuffer(file);
  if (file) {
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      extractTextFromPDF(data);
    };
  }
}

let imgFiles = ref();
// pdf转img
function pdf2Img(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file); //将文件读取为 DataURL
  reader.onload = function () {
    //文件读取成功完成时触发
    const loadingTask = PDFJS.getDocument(reader.result);
    loadingTask.promise.then((pdf) => {
      var pageNum = pdf.numPages;
      //准备图片
      // for (let i = 1; i <= pageNum; i++) {
      //   let one=i;
      //   imgFiles.value.push(one);
      // }
      //处理
      for (let i = 1; i <= pageNum; i++) {
        //var canvas = document.createElement("canvas");
        //canvas.id = "pageNum" + i;

        pdf.getPage(i).then((page) => {
          const container = document.getElementById("pdf_canvas");
          const canvas = document.createElement("canvas");
          // console.log(canvas, page);
          container.appendChild(canvas);
          const ctx = canvas.getContext("2d");
          const viewport = page.getViewport({ scale: 3 });
          // 画布大小,默认值是width:300px,height:150px
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // 画布的dom大小, 设置移动端,宽度设置铺满整个屏幕
          //const clientWidth = document.body.clientWidth;
          const destWidth = 398;
          canvas.style.width = destWidth + "px";
          // 根据pdf每页的宽高比例设置canvas的高度
          canvas.style.height = destWidth * (viewport.height / viewport.width) + "px";
          page.render({
            canvasContext: ctx,
            viewport,
          });

          nextTick(() => {
            Img2Text(canvas);
          });
        });

        //加载完成
      } // end for
    });
  };
}

function encryptText(str) {
  let aa = new SyncRedactor({
    builtInRedactors: {
      names: {
        enabled: true,
        replaceWith: "****",
      },
      username: {
        enabled: true,
        replaceWith: "****",
      },
      phoneNumber: {
        enabled: true,
        replacementValue: "****",
      },
      ipAddress: {
        enabled: false,
        replacementValue: "****",
      },
      url: {
        enabled: false,
        replacementValue: "****",
      },
      emailAddress: {
        enabled: false,
        replacementValue: "****",
      },
      streetAddress: {
        enabled: true,
        replacementValue: "****",
      },
      digits: {
        enabled: false,
        replacementValue: "****",
      },
    },
  });
  let str3 = aa
    .redact(str)
    .replaceAll("PERSON_NAME", "****")
    .replaceAll("PHONE_NUMBER", "****")
    .replaceAll("STREET_ADDRESS", "****");
  console.log(str3.replaceAll("PERSON_NAME", "****"));

  return str3;
}

function highlightElevenDigits(str) {
  // 使用正则表达式替换函数，将匹配到的数字用<mark>标签包围
  return str.replace(regex, function (match) {
    // 确保匹配到的数字总数是11位
    if (match.replace(/\s+/g, "").length === 11) {
      return `****`;
    }
    return match;
  });
}

let urlStr = ref();
// 图片转文字
const Img2Text = (file) => {
  // // 参数： 第一个参数：图像，第二个：语种
  // urlStr.value = URL.createObjectURL(file);
  // console.log(urlStr.value);
  Tesseract.recognize(file, "eng").then((d) => {
    let text = d.data.text;

    redactor.value = new SyncRedactor({
      builtInRedactors: {
        names: {
          enabled: true,
          replaceWith: "****",
        },
        username: {
          enabled: true,
          replaceWith: "****",
        },
        phoneNumber: {
          enabled: true,
          replacementValue: "****",
        },
        ipAddress: {
          enabled: false,
          replacementValue: "****",
        },
        url: {
          enabled: false,
          replacementValue: "****",
        },
        emailAddress: {
          enabled: false,
          replacementValue: "****",
        },
        streetAddress: {
          enabled: true,
          replacementValue: "****",
        },
        digits: {
          enabled: false,
          replacementValue: "****",
        },
      },
    });
    let sourceText = text.replaceAll("\n", " ").replaceAll("|", "I");
    let str = redactor.value
      .redact(text)
      .replaceAll("PERSON_NAME", "***")
      .replaceAll("PHONE_NUMBER", "***")
      .replaceAll("STREET_ADDRESS", "***")
      .replaceAll("Andy", "***")
      .replaceAll("|", "I")
      .replaceAll(
        /\b(Cash|Accounts Receivable|Inventory|Total Assets|Accounts Payable|Bank Loan Payable|Total Liabilities|Owner's Capital)s?\b/gi,
        "***"
      )
      .replaceAll(/\$\d+(,\d{3})*(\.\d{2})?/g, "***")
      .replaceAll("\n", " ");
    // TODO:  diff 存储
    let diff = findDifferentWords(str, sourceText);
    diff = diff.map((res, i) => ({
      label1: res,
      label2: `TEXT${i}`,
    }));
    if (curChatId.value) {
      let ind = chatList.value.findIndex((v) => v.id === curChatId.value);
      chatList.value[ind].textArr = diff;
      pubSetlocalList(chatList.value);
    }
    console.log(diff);
    diff.forEach((v, i) => {
      sourceText = sourceText.replaceAll(v.label1, v.label2);
    });
    console.log("加密后：", sourceText);

    records.value.push({
      type: 2,
      content: "the following is the content of a doc：" + sourceText,
      needTyped: false,
      float: "left",
      fileName: pdfFile.value?.name,
      status: 1,
      role: "user",
    });
    filsList.value.push(pdfFile.value?.name);
    updateHis();
    talkPanelScrollBottom();
    pdfFile.value = null;
    // ocrStr.value = d.data.text;
  });
};

function findDifferentWords(str1, str2) {
  // 使用正则表达式分割字符串为单词数组
  const words1 = str1.match(/\b\w+\b/g);
  const words2 = str2.match(/\b\w+\b/g);
  // 找出只在str1中存在的单词
  const uniqueToStr1 = words1?.filter((word) => !words2?.includes(word));
  // 找出只在str2中存在的单词
  const uniqueToStr2 = words2?.filter((word) => !words1?.includes(word));
  // 合并不一样的单词
  const differentWords = uniqueToStr1?.concat(uniqueToStr2);
  return differentWords;
}

//读取pdf文件里的文字
const extractTextFromPDF = (data) => {
  PDFJS.getDocument(data).promise.then((pdf) => {
    let textContent = "";
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      pdf
        .getPage(pageNumber)
        .then((page) => {
          return page.getTextContent();
        })
        .then((content) => {
          content.items.forEach((item) => {
            textContent += item.str;
          });
          textContent = textContent + "\n";
          if (pageNumber === pdf.numPages) {
            console.log(encryptText(textContent));
            console.log(textContent);
            return;
            records.value.push({
              type: 2,
              content: "the following is the content of a doc：" + textContent,
              needTyped: false,
              float: "left",
              fileName: pdfFile.value?.name,
              status: 1,
              role: "user",
            });
            filsList.value.push(pdfFile.value?.name);
            updateHis();
            talkPanelScrollBottom();
            pdfFile.value = null;
          }
        });
    }
  });
};

onBeforeMount(() => {
  setting.value = Local.get("setting") ?? {};
  let his = Local.get("chatList") || [];
  if (!his.length) {
    let id = Date.now();
    chatList.value = [
      {
        chatMode: chatMode.value,
        id,
        key: "New Conversation",
        value: [],
        editStatus: false,
        needTyped: false,
      },
    ];
    // Local.set('chatList', chatList.value);
    pubSetlocalList(chatList.value);
    curChatId.value = id;
  } else {
    chatList.value = (Local.get("chatList") || []).map((res) => ({
      ...res,
      editStatus: false,
      needTyped: false,
    }));
  }
  hadnleAction(1, null, chatList.value[0], chatList.value[0]?.chatMode);

  const { name = 1, phoneNumber = 1, streetAddress = 1, finance = 1 } =
    Local.get("setting") ?? {};
  value1.value = name;
  value2.value = phoneNumber;
  value3.value = streetAddress;
  value4.value = finance;
  Local.set("setting", {
    name: value1.value,
    phoneNumber: value2.value,
    streetAddress: value3.value,
    finance: value4.value,
  });
  redactor.value = new SyncRedactor({
    builtInRedactors: builtInRedactors.value,
  });
});
</script>

<style lang="scss" scoped>
.search-ipt {
  :deep(.el-input__wrapper) {
    background: #d2e6ff;
  }
}
.cont-main {
  // background: pink;
  height: calc(100vh - 300px);
  width: 100%;
  padding: 20px 80px;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
  .message-box {
    width: 100%;
    min-height: 30px;
    margin-bottom: 5px;
  }

  .loading-toolbar {
    height: 30px;
    line-height: 30px;
    margin: 5px 0;
    text-align: center;
    user-select: none;
    font-size: 13px;
    color: #cec4c4;

    .color-blue {
      color: #409eff;
    }
  }

  .record-box {
    display: flex;
    flex-direction: row;
    transition: 0.5s ease;

    .checkbox-column {
      display: flex;
      justify-content: center;
      flex-basis: 40px;
      flex-shrink: 0;
      order: 1;
      user-select: none;
      padding-top: 25px;

      i {
        color: #ccc;
        cursor: pointer;
        font-size: 22px;
        &.selected {
          color: #409eff !important;
        }
      }
    }

    .avatar-column {
      width: 40px;
      flex-basis: 40px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      order: 2;
      user-select: none;
      padding-top: 22px;
      flex-direction: column;
    }

    .main-column {
      flex: 1 auto;
      order: 3;
      position: relative;
      box-sizing: border-box;
      padding: 5px;
      overflow: hidden;

      .talk-title {
        display: flex;
        align-items: center;
        height: 15px;
        margin-bottom: 2px;
        font-size: 10px;
        color: #a7a0a0;
        opacity: 1;
        transition: 0.5s ease;
      }

      .talk-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        box-sizing: border-box;
        width: 100%;

        .nickname {
          font-size: 12px;
          color: #a7a0a0;
          margin: -4px 0 4px -8px;
          transform: scale(0.9);
        }
      }
    }

    &.direction-rt {
      .avatar-column {
        order: 3;
      }

      .main-column {
        order: 2;

        .talk-title {
          justify-content: flex-end;
        }

        .talk-content {
          align-items: flex-end;
        }
      }
    }

    &.checkbox-border {
      border: 1px dashed #c4c4ec;
      &:hover {
        border-color: #409eff;
      }
    }
  }
}

:deep(.el-dialog) {
  border-radius: 14px;
  padding: 40px 40px 20px 40px;
}
:deep(.el-input-group__append) {
  padding: 0;
}
:deep(.el-input--large .el-input__wrapper) {
  padding: 4px 10px;
}
:deep(.el-alert) {
  margin-top: 20px;
  background: #e2efff;
  color: #4a4a4a;
  
}

.his-sty {
  padding: 8px;
  &:hover {
    border-radius: 4px;
    background: #e2efff;
  }
}
.his-area {
  max-height: calc(100% - 70px);
  overflow: auto;
}
.selected {
  border-radius: 4px;
  background: #e2efff;
}
// :deep(.el-input__suffix-inner > :first-child) {
//   margin-left: 0 !important;
// }

:deep(.el-input-group__prepend) {
  padding: 0 6px !important;
}
.pdf-text-sty {
  font-size: 15px;
  color: rgb(74, 74, 74);
  background: rgb(255, 255, 255);
  border-radius: 0 20px 20px 20px;
  position: relative;
  min-width: 30px;
  min-height: 30px;
  padding: 10px;
  width: fit-content;
  font-family: "Microsoft YaHei";
}
</style>
