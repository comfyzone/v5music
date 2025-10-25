<script lang="ts">
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/Avatar";
  import { Button, ButtonGroup } from "$lib/components/Button";
  import { LogIn, LogOut } from "lucide-svelte";

  const user = {
    name: "Johnny Sins",
    desc: "ballas",
    Avatar: "https://github.com/shaekenit.png",
  };
</script>

<div class="w-full flex items-center justify-between p-4">
  <div class="flex items-center space-x-4">
    <Avatar className="w-16 h-16 rounded-lg">
      <AvatarImage src={user.Avatar} alt={user.name} />
      <AvatarFallback>ER</AvatarFallback>
    </Avatar>

    <div>
      <h2 class="text-lg font-semibold text-white">{user.name}</h2>
      <p class="text-sm text-white/40">{user.desc}</p>
    </div>
  </div>
  <ButtonGroup rounded="12px">
    <Button variant="outline" size="md">
      <LogIn size={16} /> Login
    </Button>
    <Button variant="outline" size="md">
      <LogOut size={16} /> Logout
    </Button>
  </ButtonGroup>
</div>

<section class="space-y-4 mb-8">
  <h2 class="font-medium text-lg">Variants</h2>
  <div class="flex gap-3">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
  </div>
</section>

<section class="space-y-4 mb-8">
  <h2 class="font-medium text-lg">Sizes</h2>
  <div class="flex items-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
</section>

<section class="space-y-4 mb-8">
  <h2 class="font-medium text-lg">Link Button</h2>
  <div class="flex gap-3">
    <Button href="#" variant="primary">
      Go to Login <LogIn size={14} class="ml-2" />
    </Button>
    <Button href="#" variant="outline">Svelte Docs</Button>
  </div>
</section>

<section class="space-y-4 mb-8">
  <h2 class="font-medium text-lg">Disabled & Loading</h2>
  <div class="flex gap-3">
    <Button disabled>Disabled</Button>
    <Button loading>Loading</Button>
  </div>
</section>

<section class="space-y-4 mb-8">
  <h2 class="font-medium text-lg">Button Groups</h2>

  <ButtonGroup rounded="8px">
    <Button>First</Button>
    <Button>Middle</Button>
    <Button>Last</Button>
  </ButtonGroup>

  <ButtonGroup vertical={true} rounded="5px">
    <Button>Top</Button>
    <Button>Middle</Button>
    <Button>Bottom</Button>
  </ButtonGroup>
</section>

<section class="space-y-4 mb-8">
  <h2 class="font-medium text-lg">Round Buttons</h2>
  <Button borderRadius="0px">Default</Button>
  <Button borderRadius="10px 5px 15px" variant="outline">Three corners</Button>
  <Button borderRadius="0px 0px 0px 0px" variant="secondary">Defined as 0px</Button>
  <Button borderRadius="50% 10px 5px 1rem">Four Corners</Button>
  <Button borderRadius="50%">cirlce</Button>
</section>

<section class="space-y-4">
  <h2 class="font-medium text-lg">Full Width</h2>
  <Button fullWidth size="lg" variant="primary">Stretch Across</Button>
</section>