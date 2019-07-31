<template>
    <div>
        <video-player ref="videoPlayer" :playlistAutoPlayDelaySeconds="playlistAutoPlayDelaySeconds"
                      :playlist-enable="playlistEnable" :brand="brand" :sources="sources"
                      :options="videoOptions"></video-player>
    </div>
</template>

<script>
  export default {
    name: 'view',
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
