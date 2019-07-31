<style>
    .fullwidth {
        width: 100%;
        height: 100%;
    }

    .vjs-brand-container {
        max-width: 2rem;
    }

    .vjs-brand-container img {
        width: 90%;
        height: 90%;
    }
</style>
<template>
    <div class="fullwidth">
        <video ref="videoPlayer" class="video-js vjs-show-big-play-button-on-pause vjs-big-play-centered"></video>
    </div>
</template>

<script>
  import videojs from 'video.js'
  import videojsbrand from 'videojs-brand'
  import videocontextmenu from 'videojs-contextmenu-ui'
  import videojsplaylist from 'videojs-playlist'
  import videojsplaylistui from 'videojs-playlist-ui'

  import 'video.js/dist/video-js.css'
  import 'videojs-contextmenu-ui/dist/videojs-contextmenu-ui.css'
  import 'videojs-playlist-ui/dist/videojs-playlist-ui.css'

  export default {
    name: 'video-player',
    props: {
      // 播放列表中前个视频播放完成后延时n秒播放下一个视频
      playlistAutoPlayDelaySeconds: {
        type: Number,
        default () {
          return 2
        }
      },
      playlistEnable: {
        type: Boolean,
        default () {
          return false
        }
      },
      content: {
        type: Array,
        default () {
          return [{
            href: 'https://www.meituima.com/',
            label: 'DBH'
          }]
        }
      },
      options: {
        type: Object,
        default () {
          return {
            // 默认视频封面图片
            poster: 'https://img.hebidu.cn/assets/dbh-brand.png',
            // 预加载
            preload: true,
            autoplay: false,
            replay: true,
            controls: true,
            fluid: true,
            techOrder: ['html5'],
            aspectRatio: '4:3'
          }
        }
      },
      brand: {
        type: Object,
        default () {
          return {
            image: 'https://img.hebidu.cn/assets/dbh-brand-reverse.png',
            title: 'DBH',
            destination: 'https://www.meituima.com',
            destinationTarget: '_blank'
          }
        }
      },
      sources: {
        type: Array,
        default () {
          return []
        }
      }
    },
    watch: {
      sources: function (newVal, oldVal) { // watch it
        this.options.sources = newVal
        if (this.playlistEnable) {
          this.player.playlist(newVal)
          this.player.playlist.autoadvance(0)
        } else {
          this.player.src(newVal)
        }
      }
    },
    data () {
      return {
        player: null
      }
    },
    created () {
      if (!videojs.getPlugin('brand')) {
        videojs.registerPlugin('brand', videojsbrand)
      }

      if (!videojs.getPlugin('contextmenuUI')) {
        videojs.registerPlugin('contextmenuUI', videocontextmenu)
      }
    },
    mounted () {
      this.options.sources = this.sources
      this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () {
        console.debug('onPlayerReady', this)
        this.volume(0.6)
        this.on('ended', function () {
          console.log('play end')
        })
        this.on('contextmenu', function () {
          console.log('context menu')
        })
      })
      this.player.brand(this.brand)
      this.player.contextmenuUI({
        keepInside: false,
        content: this.content
      })
      this.player.playlist()
    },
    beforeDestroy () {
      if (this.player) {
        this.player.dispose()
      }
    },
    methods: {}
  }
</script>
