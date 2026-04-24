---
layout: page
title: Open projects
permalink: /projects/
description: Open projects for thesis or collaborations
nav: false
nav_order: 3
max_show: 6
display_categories: [
  {id: "rob",
  title: "Robotics", 
  description: ""}]
horizontal: true
---

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category.title }}" href=".#{{ category.title }}">
    <h2 class="category" style="text-align: left">{{ category.title }}</h2>
        
  </a>
<p>{{ category.description }}</p>
  {% assign categorized_projects = site.projects | where: "category", category.title %}
  {% assign sorted_projects = categorized_projects | sort: "importance" | reverse %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1">
    {% for project in sorted_projects limit:page.max_show %}
      {% include projects_horizontal.liquid %}
    {% endfor %}

{% if sorted_projects.size > page.max_show %}
<script>
var show = false;
function click_show_{{ category.id }}(){
if (show === false){
    document.getElementById('button_show_{{ category.id }}').innerHTML='Hide projects';
show = true;
}else{
document.getElementById('button_show_{{ category.id }}').innerHTML='Show other projects';
show = false;
}
}
</script>
<p style="text-align:center">
<a id="button_show_{{ category.id }}" data-toggle="collapse" href="#collapse_{{ category.id }}" role="button" aria-expanded="false" aria-controls="collapseExample" onclick="click_show_{{ category.id }}()">
     Show other projects
  </a>
</p>
<div  class="collapse" id="collapse_{{ category.id }}">
    {% for project in sorted_projects offset:page.max_show %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
</div>
{% endif %}

</div>
  </div>
  {% else %}
  <div class="grid">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="grid">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
