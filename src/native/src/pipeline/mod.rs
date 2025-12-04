pub mod resolver;
pub mod transformer;

pub trait PipelineStage {
    fn name(&self) -> &str;
}
