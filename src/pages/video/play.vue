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
        <iframe v-if="vtype == 'iframe_insert'" width="640px" height="480px" :src="vuri" allowfullscreen></iframe>

        <video-player v-if="vtype != 'iframe_insert' && vtype != 'cloud_disk'" ref="videoPlayer"
                      :playlistAutoPlayDelaySeconds="playlistAutoPlayDelaySeconds"
                      :playlist-enable="playlistEnable" :brand="brand" :sources="sources"
                      :options="videoOptions"></video-player>
    </div>
</template>

<script>
  import VideoPlayer from '@/components/video-player.vue'

  export default {
    name: 'play',
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
        }
      }
    },
    mounted () {
      this.playlistEnable = false
      this.sources = [
        {
          type: decodeURIComponent(this.vtype),
          src: decodeURIComponent(this.vuri)
        }
      ]
    }
  }
</script>

<style scoped>

</style>
