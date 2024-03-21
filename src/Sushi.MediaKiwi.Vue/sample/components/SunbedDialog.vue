<script setup lang="ts">
  import { useI18next, MkDialogCard } from "@supershift/mediakiwi-vue";

  // inject dependencies
  const { t } = await useI18next();

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();
</script>

<template>
  <MkDialogCard :title="t('Sunbeds')" @click:close="() => emit('click:close')">
    <template #intro> Sunbed Dialog, You can do whatever you like</template>
    <Suspense>
      <div class="sunbed-dialog">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit tristique arcu elementum molestie. Vestibulum ullamcorper mi eget neque
          molestie hendrerit. Nulla sapien nisl, elementum sit amet lectus sit amet, fringilla aliquam ex. Mauris blandit magna fermentum arcu placerat
          elementum. Fusce consectetur nisi a auctor mattis. Etiam tristique ultricies mauris, sed aliquam est porta vitae. Nunc venenatis dapibus tellus, et
          interdum ante dapibus non. Donec semper hendrerit odio, ac euismod purus mollis id. Nulla et dictum mi, varius laoreet nisl. Vestibulum dignissim
          cursus quam a viverra. Integer sit amet sem porttitor, placerat nunc ac, egestas augue. Integer id lectus neque.
        </p>
        <br />
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas auctor magna mollis sapien consectetur sagittis.
          Vestibulum eu molestie ante. Curabitur tempor elit a justo fermentum vestibulum. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Morbi rhoncus pulvinar nisi ac lobortis. Praesent vel accumsan tortor, vitae vulputate lorem. Fusce tristique, mi sit amet
          porta vulputate, magna diam suscipit lorem, non sollicitudin risus lacus id est. Cras vel velit in ligula rhoncus vulputate in vitae dui. Vestibulum
          eget ipsum nulla.
        </p>
        <br />
        <p>
          Praesent laoreet mauris eget turpis pulvinar aliquet sed eget ipsum. Donec sed odio eu augue ornare fermentum. Morbi ut hendrerit neque. In faucibus
          elit eu tortor mattis convallis. Mauris mattis mauris massa, a mattis dui hendrerit ut. Duis eget imperdiet turpis, eget interdum nulla. Nulla
          facilisi. Etiam egestas mollis rutrum. Fusce iaculis metus fermentum ante elementum dignissim. Nulla semper sem a quam interdum, et porta ipsum
          finibus. Nam vestibulum cursus nisl sit amet posuere. Etiam magna tellus, pharetra in justo at, vehicula auctor lacus.
        </p>
        <br />
        <p>
          Integer scelerisque lacinia lorem nec imperdiet. Vestibulum imperdiet eros porttitor tortor condimentum tristique. Vivamus porttitor purus est, vitae
          iaculis nisi volutpat eget. Nulla volutpat elit mattis, luctus sem in, faucibus felis. Mauris urna enim, maximus ac venenatis viverra, sodales ut
          ipsum. Vestibulum et rhoncus ipsum. Etiam ullamcorper risus quis interdum ornare. Integer suscipit magna orci, semper bibendum libero pretium eu.
          Donec vitae commodo ex. Nulla in maximus arcu, ultricies elementum lorem. Praesent ornare massa nec est faucibus vulputate. Quisque vel feugiat magna,
          vel porta nibh. Vestibulum viverra leo ut lectus feugiat, vitae malesuada lacus aliquet. Sed a commodo magna, eu sagittis ex. Vestibulum sit amet
          imperdiet massa, vel elementum risus. Aenean sed malesuada neque.
        </p>
        <br />
        <p>
          In hac habitasse platea dictumst. Ut in diam magna. Nulla facilisi. Fusce efficitur elementum aliquet. Fusce pharetra congue sollicitudin.
          Pellentesque eu lorem lobortis, ornare tortor vel, tempus mauris. Morbi mattis ullamcorper laoreet. Quisque posuere tortor non orci volutpat ultrices.
        </p>
        <br />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit tristique arcu elementum molestie. Vestibulum ullamcorper mi eget neque
          molestie hendrerit. Nulla sapien nisl, elementum sit amet lectus sit amet, fringilla aliquam ex. Mauris blandit magna fermentum arcu placerat
          elementum. Fusce consectetur nisi a auctor mattis. Etiam tristique ultricies mauris, sed aliquam est porta vitae. Nunc venenatis dapibus tellus, et
          interdum ante dapibus non. Donec semper hendrerit odio, ac euismod purus mollis id. Nulla et dictum mi, varius laoreet nisl. Vestibulum dignissim
          cursus quam a viverra. Integer sit amet sem porttitor, placerat nunc ac, egestas augue. Integer id lectus neque.
        </p>
        <br />
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas auctor magna mollis sapien consectetur sagittis.
          Vestibulum eu molestie ante. Curabitur tempor elit a justo fermentum vestibulum. Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Morbi rhoncus pulvinar nisi ac lobortis. Praesent vel accumsan tortor, vitae vulputate lorem. Fusce tristique, mi sit amet
          porta vulputate, magna diam suscipit lorem, non sollicitudin risus lacus id est. Cras vel velit in ligula rhoncus vulputate in vitae dui. Vestibulum
          eget ipsum nulla.
        </p>
        <br />
        <p>
          Praesent laoreet mauris eget turpis pulvinar aliquet sed eget ipsum. Donec sed odio eu augue ornare fermentum. Morbi ut hendrerit neque. In faucibus
          elit eu tortor mattis convallis. Mauris mattis mauris massa, a mattis dui hendrerit ut. Duis eget imperdiet turpis, eget interdum nulla. Nulla
          facilisi. Etiam egestas mollis rutrum. Fusce iaculis metus fermentum ante elementum dignissim. Nulla semper sem a quam interdum, et porta ipsum
          finibus. Nam vestibulum cursus nisl sit amet posuere. Etiam magna tellus, pharetra in justo at, vehicula auctor lacus.
        </p>
        <br />
        <p>
          Integer scelerisque lacinia lorem nec imperdiet. Vestibulum imperdiet eros porttitor tortor condimentum tristique. Vivamus porttitor purus est, vitae
          iaculis nisi volutpat eget. Nulla volutpat elit mattis, luctus sem in, faucibus felis. Mauris urna enim, maximus ac venenatis viverra, sodales ut
          ipsum. Vestibulum et rhoncus ipsum. Etiam ullamcorper risus quis interdum ornare. Integer suscipit magna orci, semper bibendum libero pretium eu.
          Donec vitae commodo ex. Nulla in maximus arcu, ultricies elementum lorem. Praesent ornare massa nec est faucibus vulputate. Quisque vel feugiat magna,
          vel porta nibh. Vestibulum viverra leo ut lectus feugiat, vitae malesuada lacus aliquet. Sed a commodo magna, eu sagittis ex. Vestibulum sit amet
          imperdiet massa, vel elementum risus. Aenean sed malesuada neque.
        </p>
        <br />
        <p>
          In hac habitasse platea dictumst. Ut in diam magna. Nulla facilisi. Fusce efficitur elementum aliquet. Fusce pharetra congue sollicitudin.
          Pellentesque eu lorem lobortis, ornare tortor vel, tempus mauris. Morbi mattis ullamcorper laoreet. Quisque posuere tortor non orci volutpat ultrices.
        </p>
      </div>
    </Suspense>
  </MkDialogCard>
</template>
