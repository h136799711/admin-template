<style>
    .center-player {
        width: 480px;
        margin: 0 auto;
    }

    iframe {
        border: 0px;
    }
</style>
<template>
  <div class="center-player">
    <h3>视频源详情</h3>
    <iframe
      v-if="vtype == 'iframe_insert'"
      width="640px"
      height="480px"
      :src="vuri"
      allowfullscreen
    />

    <div v-if="vtype == 'cloud_disk'">
      网盘地址: {{ this.panUri }}<br>
      <span v-if="panPwd != ''">
        网盘密码: {{ this.panPwd }}
      </span>
    </div>
    <video-player
      v-if="vtype != 'iframe_insert' && vtype != 'cloud_disk'"
      ref="videoPlayer"
      :playlist-auto-play-delay-seconds="playlistAutoPlayDelaySeconds"
      :playlist-enable="playlistEnable"
      :brand="brand"
      :sources="sources"
      :options="videoOptions"
    />
  </div>
</template>

<script>
import VideoPlayer from '@/components/video-player.vue'

export default {
  name: 'Play',
  components: {
    VideoPlayer
  },
  props: {
    vtype: {
      type: String,
      require: true,
      default () {
        return ''
      }
    },
    vuri: {
      type: String,
      require: true,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      playlistAutoPlayDelaySeconds: 3,
      playlistEnable: false,
      videoOptions: {
        preload: true,
        autoplay: false,
        controls: true,
        poster: 'https://img.hebidu.cn/assets/dbh-brand.png',
        fluid: true
      },
      sources: [],
      brand: {
        image: 'https://img.hebidu.cn/assets/dbh-brand-reverse.png',
        title: 'DBH',
        destination: 'https://www.meituima.com',
        destinationTarget: '_blank'
      },
      panUri: '',
      panPwd: ''
    }
  },
  mounted () {
    this.playlistEnable = false
    if (this.vtype !== 'iframe_insert' && this.vtype !== 'cloud_disk') {
      this.sources = [
        {
          type: decodeURIComponent(this.vtype),
          src: decodeURIComponent(this.vuri)
        }
      ]
    }
    if (this.vtype === 'cloud_disk') {
      if (this.vuri.indexOf('@') !== false) {
        let split = this.vuri.split('@')
        if (split && split.length === 2) {
          this.panUri = split[0]
          this.panPwd = split[1]
        }
      } else {
        this.panUri = this.vuri
      }
    }
  }
}
</script>

<style scoped>

</style>
