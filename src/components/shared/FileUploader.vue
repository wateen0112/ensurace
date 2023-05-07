<!-- eslint-disable vue/require-default-prop -->
<script setup lang="ts">
import { useFile } from '@/composables/index'
// eslint-disable-next-line vue/prefer-import-from-vue
import { hasOwn, isArray } from '@vue/shared'
import Compressor from 'compressorjs'
import { v4 as uuid } from 'uuid'
import { computed, ref, useAttrs } from 'vue'

export interface fileDto {
  file: File | undefined
  url: string
  id: string
  type: 'image' | 'document' | 'video' | ''
}

const props = defineProps({
  url: String,
  urls: Array,
  base64: Boolean,
  quality: {
    type: Number,
    default: 0.5,
  },
  contain: {
    type: Boolean,
    default: false,
  },
  cover: {
    type: Boolean,
    default: true,
  },
  deleteBtnClass: String,
  previwerContainerClass: String,
  previwerItemClass: String,
  previewImageClass: String,
  modelValue: {
    type: [Object, Array, null],
    default: null,
  },
  maxSize: Number,
  maxWidth: Number,
  maxHeight: Number,
  deletedUrls: Array,
} as any)

const emit = defineEmits(['update:modelValue', 'update:url', 'update:deletedUrls'])
const { getFileExt, getFileType, getFileUrl } = useFile()
const fileInput = ref<HTMLInputElement | null>(null)
const id = Date.now() * (Math.random() * 10000)
const files = ref<fileDto[]>([])
const urls = ref<string[]>([])
const attrs = useAttrs()
const isMulti = computed(() => hasOwn(attrs, 'multiple'))
const deletedUrls = ref<string[]>([])
function showUploadFileWindow() {
  if (fileInput.value)
    fileInput.value.click()
}
function compressFile(file: File) {
  return new Promise<File>((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(file, {
      quality: props.quality,
      success(result) {
        resolve(
          new File([result], file.name, {
            lastModified: new Date().getTime(),
            type: result.type,
          }),
        )
      },
      error(err) {
        reject(err)
      },
    })
  })
}


function reset() {
  files.value = [];
  urls.value = [];
}

function deleteFile(e: any, fId: string) {
  e.stopImmediatePropagation()

  files.value = files.value.filter(f => {
    if (f.id === fId)
      URL.revokeObjectURL(f.url)

    return f.id !== fId
  })

  uploadEvent()
}
async function setFiles(filesList: FileList) {
  for (const file of filesList) {
    const fileType = getFileType(getFileExt(file.name))
    let compressedFile
    try {
      compressedFile = await compressFile(file)
    }
    catch (er) {
      console.log(er)
    }
    if (compressedFile && isMulti.value) {
      files.value.push({
        file: compressedFile,
        id: uuid(),
        type: fileType,
        url: URL.createObjectURL(file),
      })
      console.log(isMulti, compressFile)
    }
    else {
      files.value = []
      urls.value = []
      files.value[0] = {
        file: compressedFile,
        id: uuid(),
        type: fileType,
        url: URL.createObjectURL(file),
      }
    }

    uploadEvent()
  }
}
function uploadEvent() {
  if (isMulti.value) {
    emit('update:modelValue', files.value.map(({ file }) => file))
    emit('update:url', files.value.map(({ url }) => url))
  }
  else {
    emit('update:modelValue', files.value.length ? files.value[0].file : null)
    emit('update:url', files.value.length ? files.value[0].url : '')
  }
}
function clickHandler(e: any) {
  const filesList: FileList = e.target.files

  setFiles(filesList)
}
function dropHandler(ev: any) {
  ev.preventDefault()

  const tempFiles = ev.dataTransfer.files

  setFiles(tempFiles)
}
function dragOverHandler(ev: any) {
  ev.preventDefault()
}
function deleteUrl(e: any, url: string) {
  e.stopImmediatePropagation()

  deletedUrls.value.push(url);
  urls.value = urls.value.filter(u => u !== url)
  emit('update:deletedUrls', deletedUrls)
}

onMounted(() => {
  if (props.url) {
    if (typeof props.url === 'string')
      urls.value.push(props.url)
    else if (Array.isArray(props.url))
      urls.value = [...urls.value, ...props.url]
  }
})
const modelValue = computed(() => props.modelValue);

watch(modelValue,
  nv => {
    console.log('model Value Change', nv);

    if (nv === null || (isArray(nv) && nv.length === 0) || nv === '')
      reset();

  },
  { deep: true },
);

defineExpose({
  reset,
});

// function validateFile(file: File): boolean {
//   // if (isImage(getFileExt(file.name))) {
//   //   let imgWidth, imgHeight;
//   //   const fileUrl = URL.createObjectURL(file);
//   //   const img = new Image();

//   //   img.src = fileUrl;
//   //   console.log(imgHeight,imgWidth);

//   // }
//   return true
// }
</script>

<template>
  <div class="vue-file-uploader">
    <button type="button" class="vue-file-uploader-btn"
      @click="showUploadFileWindow" @drop="dropHandler"
      @dragover="dragOverHandler">
      <slot>
        <span> أنقر او اسحب الملف الى هنا </span>
        <svg style="width: 45px; height: 45px;" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04M19,18H6A4,4 0 0,1 2,14C2,11.95 3.53,10.24 5.56,10.03L6.63,9.92L7.13,8.97C8.08,7.14 9.94,6 12,6C14.62,6 16.88,7.86 17.39,10.43L17.69,11.93L19.22,12.04C20.78,12.14 22,13.45 22,15A3,3 0 0,1 19,18M8,13H10.55V16H13.45V13H16L12,9L8,13Z" />
        </svg>
      </slot>
      <div class="vue-file-uploader-preview"
        :class="[{ multi: isMulti }, previwerContainerClass]">
        <div v-for="(url, i) in urls" :key="i"
          class="vue-file-uploader-preview-item"
          :class="previwerItemClass">
          <img :src="getFileUrl(url)" :class="previewImageClass">
          <div class="preview-item-overlay">
            <button :id="`delete-btn-${i}`" :class="deleteBtnClass"
              class="vue-file-uploader-preview-item-delete-btn"
              @click="deleteUrl($event, url)">
              <slot name="delete-btn">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                </svg>
              </slot>
            </button>
          </div>
        </div>
        <div v-for="(file, i) in files" :key="file.id"
          class="vue-file-uploader-preview-item"
          :class="previwerItemClass">
          <img :src="file.url" :class="previewImageClass">
          <div class="preview-item-overlay">
            <div v-if="file.file" class="info">
              <span>Name : {{ file.file.name }}</span>
              <span>Size : {{ (file.file.size / 1000000).toFixed(2)
              }}mb</span>
            </div>

            <button :id="`delete-btn-${i}`" :class="deleteBtnClass"
              class="vue-file-uploader-preview-item-delete-btn"
              @click="deleteFile($event, file.id)">
              <slot name="delete-btn">
                <svg viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" />
                </svg>
              </slot>
            </button>
          </div>
        </div>
      </div>
    </button>
    <input :id="`file-uploader-${id}`" ref="fileInput" v-bind:="$attrs"
      type="file" hidden @change="clickHandler">
  </div>
</template>

<style scoped lang="scss">
.vue-file-uploader {
  &-btn {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    border: 1px dashed theme('colors.gray.300');
    color: theme('colors.gray.400');

    .vue-file-uploader-preview {
      &-item {
        position: relative;

        img {
          width: 100%;
          max-height: 300px;
        }

        .preview-item-overlay {
          position: absolute;
          visibility: hidden;
          display: flex;
          flex-direction: column;
          opacity: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          top: 0;
          background-color: rgba(36, 36, 36, 0.729);
          transition: 0.5s;

          .info {
            padding: 0.5rem;
            display: flex;
            align-items: flex-end;
            flex-direction: column;

            span {
              text-align: initial;
              color: #ffffff;
              font-size: 14px;
            }
          }

          button {
            border-radius: 5px;
            align-self: center;
            color: #ffffff;
            position: absolute;
            top: 44.5%;

            svg {
              height: 4rem;
            }
          }
        }

        &:hover {
          .preview-item-overlay {
            visibility: visible;
            opacity: 1;
          }
        }
      }

      &.multi {
        display: grid;
        position: relative;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;

        img {
          height: 150px;
          object-fit: contain;
        }

        .info {
          span {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
